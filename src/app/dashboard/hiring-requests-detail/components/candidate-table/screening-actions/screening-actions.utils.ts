import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

const CONFIG_FAILURE_MARKERS = [
  "error-get-transport",
  "error-get-resources-validation",
  "vapi api error 401",
  "vapi api error 403",
  "api key",
];

function isConfigFailure(candidate: Applicant): boolean {
  const review = candidate.screeningReview;
  const reason = `${review?.endedReason ?? ""} ${review?.summary ?? ""}`.toLowerCase();
  return CONFIG_FAILURE_MARKERS.some((marker) => reason.includes(marker));
}

function isLiveCall(candidate: Applicant): boolean {
  const status = candidate.screeningReview?.callStatus;
  return status === "initiated" || status === "in_progress";
}

function isTechnicalFailure(candidate: Applicant): boolean {
  const review = candidate.screeningReview;
  return review?.callStatus === "failed" || review?.callOutcome === "failed";
}

export function canTriggerScreeningCall(candidate: Applicant): boolean {
  if (!candidate.phone) return false;
  if (isLiveCall(candidate)) return false;
  if (isTechnicalFailure(candidate) && isConfigFailure(candidate)) return false;
  return true;
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
