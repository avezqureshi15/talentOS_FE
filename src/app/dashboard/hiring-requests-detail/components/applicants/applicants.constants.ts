import type { StateConfig } from "./applicants.types";

export const SCORE_FILTERS = [
  { value: "all", label: "All Scores" },
  { value: "gte80", label: "≥ 80" },
  { value: "gte70", label: "≥ 70" },
  { value: "gte50", label: "≥ 50" },
  { value: "lt50", label: "< 50" },
  { value: "lt30", label: "< 30" },
] as const;

export const ROUND_VERDICT_FILTERS = [
  { value: "all", label: "All Candidates" },
  { value: "selected", label: "Shortlisted" },
  { value: "rejected", label: "Rejected" },
] as const;

export const REJECT_REASON_OPTIONS = [
  { value: "yoe", label: "YOE" },
  { value: "location", label: "Location" },
  { value: "budget", label: "Budget" },
  { value: "notice_period", label: "Notice Period" },
] as const;

export const ROUND_VERDICT_LABELS: Record<string, string> = {
  selected: "Shortlisted",
  rejected: "Rejected",
};

export const INFO_CHIP_SKIP_KEYS = new Set([
  "fitscore",
  "summary",
  "summary_md",
  "rejection_details",
  "strong_matches",
  "gaps_and_concerns",
]);

/** Statuses that show JD-vs-candidate comparison info chips. */
export const INFO_CHIP_STATUSES = new Set([
  "under_evaluation",
  "shortlisted",
  "move_to_next_round",
  "interview_rescheduled",
]);

/** Statuses that show the ATS score column (active pipeline). */
export const ATS_SCORE_STATUSES = new Set([
  "queued",
  "processing",
  "under_evaluation",
  "shortlisted",
  "move_to_next_round",
  "interview_scheduled",
  "interview_rescheduled",
  "interview_cancelled",
  "waiting_for_review",
  "invalid",
  "failed",
]);

export const ATS_SCORE_TOOLTIP =
  "ATS score is calculated based on how the resume matches job description";

/** Active interview / review round still in flight. */
export const CURRENT_ROUND_LABEL = "Current round";

/**
 * Previous round finished; next interview not booked yet
 * (e.g. AI shortlisted, move_to_next_round).
 */
export const LAST_ROUND_LABEL = "Last round";

export const QUEUED_CONFIG: StateConfig = {
  state: "queued",
  chip: { label: "Queued", variant: "neutral" },
  showInfoChips: false,
  showAtsScore: true,
  showExpandedContent: true,
  actions: [],
  menuActions: ["select", "reject"],
};

export const PROCESSING_CONFIG: StateConfig = {
  state: "processing",
  chip: { label: "Screening", variant: "info" },
  showInfoChips: false,
  showAtsScore: true,
  showExpandedContent: true,
  actions: [],
  menuActions: ["select", "reject"],
};

export const WAITING_FOR_REVIEW_CONFIG: StateConfig = {
  state: "waiting_for_review",
  chip: { label: "Awaiting review", variant: "yellow" },
  showInfoChips: false,
  showAtsScore: true,
  showExpandedContent: true,
  actions: [],
  menuActions: ["select", "reject"],
};

export const UNDER_EVALUATION_CONFIG: StateConfig = {
  state: "under_evaluation",
  chip: { label: "Under review", variant: "info" },
  showInfoChips: true,
  showAtsScore: true,
  showExpandedContent: true,
  actions: [
    { label: "Shortlist", icon: "bx bx-check", variant: "shortlist", handler: "onShortlist" },
    { label: "Reject", icon: "bx bx-x", variant: "reject", handler: "onRejectFromEvaluation" },
  ],
  menuActions: ["select", "reject"],
};

export const SHORTLISTED_CONFIG: StateConfig = {
  state: "shortlisted",
  chip: { label: "Shortlisted", variant: "success" },
  showInfoChips: true,
  showAtsScore: true,
  showExpandedContent: true,
  actions: [
    { label: "Schedule interview", icon: "bx bx-calendar", variant: "schedule", handler: "onScheduleInterview" },
  ],
  menuActions: ["select", "reject"],
};

export const MOVE_TO_NEXT_ROUND_CONFIG: StateConfig = {
  state: "move_to_next_round",
  chip: { label: "Ready to schedule", variant: "yellow" },
  showInfoChips: true,
  showAtsScore: true,
  showExpandedContent: true,
  actions: [
    { label: "Schedule interview", icon: "bx bx-calendar", variant: "schedule", handler: "onScheduleInterview" },
  ],
  menuActions: ["select", "reject"],
};

export const INTERVIEW_SCHEDULED_CONFIG: StateConfig = {
  state: "interview_scheduled",
  chip: { label: "Interview scheduled", variant: "info" },
  showInfoChips: false,
  showAtsScore: true,
  showExpandedContent: true,
  actions: [],
  menuActions: ["select", "reject"],
};

export const INTERVIEW_RESCHEDULED_CONFIG: StateConfig = {
  state: "interview_rescheduled",
  chip: { label: "Interview rescheduled", variant: "warning" },
  showInfoChips: true,
  showAtsScore: true,
  showExpandedContent: true,
  actions: [],
  menuActions: ["select", "reject"],
};

export const INTERVIEW_CANCELLED_CONFIG: StateConfig = {
  state: "interview_cancelled",
  chip: { label: "Interview cancelled", variant: "danger" },
  showInfoChips: false,
  showAtsScore: true,
  showExpandedContent: true,
  actions: [],
  menuActions: ["select", "reject"],
};

export const INVALID_CONFIG: StateConfig = {
  state: "invalid",
  chip: { label: "Invalid resume", variant: "danger" },
  showInfoChips: false,
  showAtsScore: true,
  showExpandedContent: true,
  actions: [],
  menuActions: ["select", "reject"],
};

export const FAILED_CONFIG: StateConfig = {
  state: "failed",
  chip: { label: "Screening failed", variant: "danger" },
  showInfoChips: false,
  showAtsScore: true,
  showExpandedContent: true,
  actions: [],
  menuActions: ["select", "reject"],
};

export const REJECTED_CONFIG: StateConfig = {
  state: "rejected",
  chip: { label: "Rejected", variant: "danger" },
  showInfoChips: false,
  showAtsScore: false,
  showExpandedContent: false,
  actions: [],
  menuActions: [],
  footerBadge: { text: "Candidate rejected and moved out of pipeline", className: "rejected-text" },
};

export const SELECTED_CONFIG: StateConfig = {
  state: "selected",
  chip: { label: "Selected", variant: "success" },
  showInfoChips: false,
  showAtsScore: false,
  showExpandedContent: false,
  actions: [],
  menuActions: [],
  footerBadge: { text: "Candidate selected and moved out of pipeline", className: "selected-text" },
};

export const STATE_CONFIGS: Record<string, StateConfig> = {
  queued: QUEUED_CONFIG,
  processing: PROCESSING_CONFIG,
  waiting_for_review: WAITING_FOR_REVIEW_CONFIG,
  under_evaluation: UNDER_EVALUATION_CONFIG,
  shortlisted: SHORTLISTED_CONFIG,
  move_to_next_round: MOVE_TO_NEXT_ROUND_CONFIG,
  interview_scheduled: INTERVIEW_SCHEDULED_CONFIG,
  interview_rescheduled: INTERVIEW_RESCHEDULED_CONFIG,
  interview_cancelled: INTERVIEW_CANCELLED_CONFIG,
  invalid: INVALID_CONFIG,
  failed: FAILED_CONFIG,
  rejected: REJECTED_CONFIG,
  selected: SELECTED_CONFIG,
};
