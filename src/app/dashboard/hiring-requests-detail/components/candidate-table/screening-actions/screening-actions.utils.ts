import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";
import {
  DEFAULT_AI_SCREENING_SETTINGS,
  type AiScreeningSettings,
} from "@/services/settings/screening-settings";

const CONFIG_FAILURE_MARKERS = [
  "error-get-transport",
  "error-get-resources-validation",
  "vapi api error 401",
  "vapi api error 403",
  "api key",
];

const LIVE_CALL_STATUSES = new Set(["initiated", "in_progress"]);

function isConfigFailure(candidate: Applicant): boolean {
  const review = candidate.screeningReview;
  const reason = `${review?.endedReason ?? ""} ${review?.summary ?? ""}`.toLowerCase();
  return CONFIG_FAILURE_MARKERS.some((marker) => reason.includes(marker));
}

function isLiveCall(candidate: Applicant): boolean {
  const status = candidate.screeningReview?.callStatus;
  return LIVE_CALL_STATUSES.has(status ?? "");
}

function isTechnicalFailure(candidate: Applicant): boolean {
  const review = candidate.screeningReview;
  return review?.callStatus === "failed" || review?.callOutcome === "failed";
}

function isConnectFailure(candidate: Applicant): boolean {
  const outcome = candidate.screeningReview?.callOutcome;
  return outcome === "no_answer" || outcome === "voicemail" || outcome === "dropped";
}

function isSuccessfulCall(candidate: Applicant): boolean {
  const review = candidate.screeningReview;
  if (review?.callStatus !== "completed") return false;
  if (review.callOutcome === "completed") return true;
  return review.result === "pass" || review.result === "fail" || review.result === "needs_review";
}

/** Whether the candidate's screening call has already completed successfully. */
export function isScreeningCallCompleted(candidate: Applicant): boolean {
  return isSuccessfulCall(candidate);
}

/** ISO 3166-1 alpha-2 → E.164 calling code — mirrors the POC's REGION_DIAL_CODES (backend/app/services/phone_validation.py). */
const REGION_DIAL_CODES: Record<string, string> = {
  IN: "91",
  US: "1",
  CA: "1",
  GB: "44",
  AU: "61",
  AE: "971",
  SG: "65",
  MY: "60",
  PH: "63",
  ID: "62",
  TH: "66",
  VN: "84",
  NP: "977",
  BD: "880",
  LK: "94",
  PK: "92",
  SA: "966",
  QA: "974",
  KW: "965",
  OM: "968",
  BH: "973",
  DE: "49",
  FR: "33",
  NL: "31",
  IE: "353",
  NZ: "64",
  ZA: "27",
  NG: "234",
  KE: "254",
};

/** Port of the POC's _allowed_dial_codes + _match_allowed_code — longest-prefix dial-code match, with the IN 10-digit local special case. */
function phoneMatchesAllowedRegions(phone: string, regions: string[]): boolean {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return false;

  const dialCodes: string[] = [];
  for (const region of regions) {
    const code = REGION_DIAL_CODES[(region ?? "").trim().toUpperCase()];
    if (code && !dialCodes.includes(code)) dialCodes.push(code);
  }
  if (dialCodes.length === 0) return false;

  for (const code of [...dialCodes].sort((a, b) => b.length - a.length)) {
    if (digits.startsWith(code) && digits.length > code.length) return true;
    if (code === "91" && digits.length === 10) return true;
  }
  return false;
}

function dialAttemptsExhausted(candidate: Applicant, maxRetries: number): boolean {
  return (candidate.screeningReview?.retryCount ?? 0) >= maxRetries - 1;
}

/**
 * Mirrors the POC's canCallNowForRow (hr-app/src/components/screening/screeningRows.ts)
 * and phone validation (backend/app/services/phone_validation.py):
 * - no phone, or phone not matching any allowed region dial-code when geography
 *   is enforced (or zero configured regions → nothing can be called) → hidden
 * - live call (initiated/in_progress) → hidden
 * - already-completed call → hidden
 * - config/technical failure (transport, Vapi 401/403, api key) → hidden
 * - flagged/completed disposition → shown
 * - pending → shown only when there is no call record yet, a scheduled retry,
 *   or a connect failure (no_answer/voicemail/dropped) within max attempts;
 *   queued calls are hidden.
 */
export function canTriggerScreeningCall(
  candidate: Applicant,
  settings?: AiScreeningSettings,
): boolean {
  const s = settings ?? DEFAULT_AI_SCREENING_SETTINGS;

  if (!candidate.phone) return false;
  if (s.enforce_phone_geography) {
    if (!phoneMatchesAllowedRegions(candidate.phone, s.allowed_phone_regions)) return false;
  }

  if (isLiveCall(candidate)) return false;
  if (isSuccessfulCall(candidate)) return false;
  if (isTechnicalFailure(candidate) && isConfigFailure(candidate)) return false;

  const review = candidate.screeningReview;
  const flagged =
    review?.disposition === "flagged" ||
    candidate.status?.toLowerCase() === "ai_screening_flagged" ||
    candidate.status?.toLowerCase() === "ai_screening_evaluation_failed" ||
    review?.callOutcome === "declined" ||
    isTechnicalFailure(candidate) ||
    (isConnectFailure(candidate) && dialAttemptsExhausted(candidate, s.screening_max_retries));

  if (flagged) return true;

  if (!review) return true;
  if (review.callStatus === "pending" && (review.retryCount ?? 0) > 0) return true;

  return isConnectFailure(candidate) && !dialAttemptsExhausted(candidate, s.screening_max_retries);
}

export function getScreeningStatusLabel(candidate: Applicant): string {
  const review = candidate.screeningReview;
  const status = candidate.status?.toLowerCase() ?? "";
  const flagReason = review?.flagReason ?? "";
  const isFlagged =
    review?.disposition === "flagged" ||
    status === "ai_screening_flagged" ||
    status === "ai_screening_evaluation_failed";

  if (isFlagged) {
    if (flagReason.toLowerCase().includes("maximum attempts")) return "Max Attempts Reached";
    if (review?.callOutcome === "no_answer" || review?.callOutcome === "failed") return "Unable to Connect";
    if (flagReason.toLowerCase().includes("needs hr review")) return "Needs Review";
    return "Flagged";
  }

  if (isLiveCall(candidate)) return "Call In Progress";

  if (review?.callStatus === "pending") {
    if ((review?.retryCount ?? 0) > 0) return "Retry Scheduled";
    return "Queued";
  }

  if (review?.callOutcome === "no_answer" || review?.callOutcome === "failed") return "Unable to Connect";
  if (review?.callOutcome === "voicemail") return "Voicemail";
  if (review?.callOutcome === "dropped") return "Call Dropped";
  if (review?.callOutcome === "completed" || review?.callStatus === "completed") {
    if (review?.result === "needs_review") return "Needs Review";
    return "Completed";
  }

  return "Pending";
}

const SCREENING_CHIP_CLASSES: Record<string, string> = {
  "Max Attempts Reached": "flagged",
  "Unable to Connect": "flagged",
  "Needs Review": "warning",
  Flagged: "flagged",
  "Call In Progress": "pending",
  "Retry Scheduled": "pending",
  Queued: "pending",
  Voicemail: "flagged",
  "Call Dropped": "flagged",
  Completed: "completed",
  Pending: "pending",
};

export function getScreeningChipClass(label: string): string {
  return SCREENING_CHIP_CLASSES[label] ?? "pending";
}

export function getScreeningFlagReason(candidate: Applicant): string {
  const review = candidate.screeningReview;
  return review?.flagReason || review?.endedReason || review?.summary || "";
}

export function formatPhoneDisplay(phone?: string): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return `+91 ${digits.slice(2)}`;
  if (digits.length === 10) return `+91 ${digits}`;
  return phone;
}
