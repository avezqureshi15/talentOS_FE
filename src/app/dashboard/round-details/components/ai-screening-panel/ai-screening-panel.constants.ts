import type { ChipVariant } from "@/components/ui/chip/chip.types";
import type { AiScreeningResultBadge, AiScreeningStatusBadge } from "./ai-screening-panel.types";
export { AI_SCREENING_TERMINAL_STATUSES } from "@/constants/constants";

export const AI_SCREENING_ROUND_TYPES = new Set<string>([
  "AI_SCREENING",
  "AI_SCREENING_ROUND",
]);

export const AI_SCREENING_LABELS = {
  TITLE: "AI Screening Call",
  IN_PROGRESS: "Call in progress — details will appear here once the screening completes.",
  SCHEDULED: "Screening scheduled. Waiting for the candidate to be reached.",
  MISSING: "No screening result available yet.",
  ERROR: "Could not load the screening result.",
  SUMMARY: "Summary",
  DETAILS: "Extracted Details",
  RETRIES_PREFIX: "Retries:",
  FLAGGED_TITLE: "Candidate was flagged",
  FLAGGED_BODY: "This candidate was flagged and couldn’t be screened, so screening round details aren’t available.",
  FLAGGED_REASON_PREFIX: "Reason:",
} as const;

export const AI_SCREENING_STATUS_BADGES: Record<string, AiScreeningStatusBadge> = {
  pending: { label: "Pending", variant: "neutral", icon: "bx bx-time-five" },
  initiated: { label: "Dialing", variant: "info", icon: "bx bx-phone-outgoing" },
  in_progress: { label: "In progress", variant: "info", icon: "bx bx-loader-circle" },
  completed: { label: "Completed", variant: "success", icon: "bx bx-check-circle" },
  failed: { label: "Failed", variant: "danger", icon: "bx bx-error-circle" },
};

export const AI_SCREENING_RESULT_BADGES: Record<string, AiScreeningResultBadge> = {
  pass: { label: "Passed", variant: "success", icon: "bx bx-check-shield" },
  fail: { label: "Not a fit", variant: "danger", icon: "bx bx-x-circle" },
  needs_review: { label: "Needs review", variant: "warning", icon: "bx bx-help-circle" },
};

type ExtractedFieldDef = {
  key:
    | "availability"
    | "employment_status"
    | "relevant_experience"
    | "current_ctc"
    | "expected_ctc"
    | "notice_period"
    | "location_preference"
    | "communication_quality";
  label: string;
  icon: string;
};

export const AI_SCREENING_EXTRACTED_FIELDS: ExtractedFieldDef[] = [
  { key: "availability", label: "Availability", icon: "bx bx-calendar-check" },
  { key: "employment_status", label: "Employment", icon: "bx bx-briefcase" },
  { key: "relevant_experience", label: "Relevant Experience", icon: "bx bx-medal" },
  { key: "current_ctc", label: "Current CTC", icon: "bx bx-wallet" },
  { key: "expected_ctc", label: "Expected CTC", icon: "bx bx-wallet-alt" },
  { key: "notice_period", label: "Notice Period", icon: "bx bx-hourglass" },
  { key: "location_preference", label: "Location", icon: "bx bx-map-pin" },
  { key: "communication_quality", label: "Communication", icon: "bx bx-message-rounded-detail" },
];

export const AI_SCREENING_WILLINGNESS_BADGE: Record<"true" | "false", { label: string; variant: ChipVariant; icon: string }> = {
  true: { label: "Willing to proceed", variant: "success", icon: "bx bx-check" },
  false: { label: "Not willing to proceed", variant: "danger", icon: "bx bx-x" },
};
