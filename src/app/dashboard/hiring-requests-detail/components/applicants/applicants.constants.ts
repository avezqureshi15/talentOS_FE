import type { StateConfig } from "./applicants.types";

export const SCORE_FILTERS = [
  { value: "all", label: "All Scores" },
  { value: "gte80", label: "≥ 80" },
  { value: "gte70", label: "≥ 70" },
  { value: "gte50", label: "≥ 50" },
  { value: "lt50", label: "< 50" },
  { value: "lt30", label: "< 30" },
] as const;

export const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Candidates" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "non-shortlisted", label: "Non-shortlisted" },
  { value: "scheduled", label: "Scheduled" },
  { value: "unscheduled", label: "Unscheduled" },
];

export const STATUS_FILTER_LABELS: Record<string, string> = {
  shortlisted: "Shortlisted",
  "non-shortlisted": "Non-shortlisted",
  scheduled: "Scheduled",
  unscheduled: "Unscheduled",
};

export const REJECT_FILTER_OPTIONS = [
  { value: "yoe", label: "Years of Experience" },
  { value: "budget", label: "Budget" },
  { value: "location", label: "Location" },
  { value: "notice-period", label: "Notice Period" },
  { value: "experience", label: "Experience" },
];

export const REJECT_FILTER_LABELS: Record<string, string> = {
  yoe: "Years of Experience",
  budget: "Budget",
  location: "Location",
  "notice-period": "Notice Period",
  experience: "Experience",
};

export const INFO_CHIP_SKIP_KEYS = new Set(["fitscore", "summary", "summary_md", "rejected_status", "rejected_reason", "strong_matches", "gaps_and_concerns"]);

export const INFO_CHIP_STATUSES = new Set(["under_evaluation", "shortlisted", "move_to_next_round"]);

export const WAITING_FOR_REVIEW_CONFIG: StateConfig = {
  state: "waiting_for_review",
  chip: { label: "Waiting for reviewer feedback", variant: "warning" },
  showInfoChips: false,
  showExpandedContent: true,
  actions: [],
  menuActions: ["select", "reject"],
};

export const UNDER_EVALUATION_CONFIG: StateConfig = {
  state: "under_evaluation",
  showInfoChips: true,
  showExpandedContent: true,
  actions: [
    { label: "Shortlist", icon: "bx bx-check", variant: "shortlist", handler: "onShortlist" },
    { label: "Reject", icon: "bx bx-x", variant: "reject", handler: "onRejectFromEvaluation" },
  ],
  menuActions: ["select", "reject"],
};

export const SHORTLISTED_CONFIG: StateConfig = {
  state: "shortlisted",
  showInfoChips: true,
  showExpandedContent: true,
  actions: [
    { label: "Move to Next Round", icon: "bx bx-right-arrow", variant: "move", handler: "onMoveToNextRound" },
  ],
  menuActions: ["select", "reject"],
};

export const MOVE_TO_NEXT_ROUND_CONFIG: StateConfig = {
  state: "move_to_next_round",
  showInfoChips: true,
  showExpandedContent: true,
  actions: [
    { label: "Schedule Round", icon: "bx bx-calendar", variant: "schedule", handler: "onScheduleInterview" },
  ],
  menuActions: ["select", "reject"],
};

export const INTERVIEW_SCHEDULED_CONFIG: StateConfig = {
  state: "interview_scheduled",
  chip: { label: "Interview scheduled", variant: "warning" },
  showInfoChips: false,
  showExpandedContent: true,
  actions: [],
  menuActions: ["select", "reject"],
};

export const REJECTED_CONFIG: StateConfig = {
  state: "rejected",
  chip: { label: "Moved out of pipeline", variant: "danger" },
  showInfoChips: false,
  showExpandedContent: false,
  actions: [],
  menuActions: [],
  footerBadge: { text: "Candidate rejected and moved out of pipeline", className: "rejected-text" },
};

export const SELECTED_CONFIG: StateConfig = {
  state: "selected",
  chip: { label: "Selected and closed", variant: "success" },
  showInfoChips: false,
  showExpandedContent: false,
  actions: [],
  menuActions: [],
  footerBadge: { text: "Candidate selected and moved out of pipeline", className: "selected-text" },
};

export const STATE_CONFIGS: Record<string, StateConfig> = {
  waiting_for_review: WAITING_FOR_REVIEW_CONFIG,
  under_evaluation: UNDER_EVALUATION_CONFIG,
  shortlisted: SHORTLISTED_CONFIG,
  move_to_next_round: MOVE_TO_NEXT_ROUND_CONFIG,
  interview_scheduled: INTERVIEW_SCHEDULED_CONFIG,
  rejected: REJECTED_CONFIG,
  selected: SELECTED_CONFIG,
};
