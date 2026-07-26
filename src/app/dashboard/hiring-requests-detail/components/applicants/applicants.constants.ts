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
] as const;

export const REJECT_FILTER_OPTIONS = [
  { value: "all", label: "All Rejected" },
  { value: "yoe", label: "YOE" },
  { value: "location", label: "Location" },
  { value: "budget", label: "Budget" },
  { value: "experience", label: "Experience" },
  { value: "ats_score", label: "ATS Score" },
] as const;

export const REJECT_FILTER_LABELS: Record<string, string> = {
  all: "All Rejected",
  yoe: "YOE",
  location: "Location",
  budget: "Budget",
  experience: "Experience",
  ats_score: "ATS Score",
};

export const ROUND_VERDICT_LABELS: Record<string, string> = {
  selected: "Shortlisted",
  rejected: "Rejected",
};

export const INFO_CHIP_SKIP_KEYS = new Set(["fitscore", "summary", "summary_md", "rejection_details", "strong_matches", "gaps_and_concerns"]);

export const INFO_CHIP_STATUSES = new Set(["under_evaluation", "shortlisted", "move_to_next_round", "interview_scheduled", "interview_rescheduled", "interview_cancelled"]);

export const WAITING_FOR_REVIEW_CONFIG: StateConfig = {
  state: "waiting_for_review",
  chip: { label: "Awaiting Review", variant: "yellow" },
  showInfoChips: false,
  showExpandedContent: true,
  actions: [
    { label: "Move to Screening", icon: "bx bx-phone", variant: "screen", handler: "onMoveToScreening" },
  ],
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
  chip: { label: "Interview Scheduled", variant: "info" },
  showInfoChips: false,
  showExpandedContent: true,
  actions: [],
  menuActions: ["select", "reject"],
};

export const INTERVIEW_RESCHEDULED_CONFIG: StateConfig = {
  state: "interview_rescheduled",
  chip: { label: "Interview Rescheduled", variant: "warning" },
  showInfoChips: true,
  showExpandedContent: true,
  actions: [],
  menuActions: ["select", "reject"],
};

export const INTERVIEW_CANCELLED_CONFIG: StateConfig = {
  state: "interview_cancelled",
  chip: { label: "Interview Cancelled", variant: "danger" },
  showInfoChips: false,
  showExpandedContent: true,
  actions: [],
  menuActions: ["select", "reject"],
};

export const REJECTED_CONFIG: StateConfig = {
  state: "rejected",
  chip: { label: "Moved Out Of Pipeline", variant: "danger" },
  showInfoChips: false,
  showExpandedContent: false,
  actions: [],
  menuActions: [],
  footerBadge: { text: "Candidate rejected and moved out of pipeline", className: "rejected-text" },
};

export const SELECTED_CONFIG: StateConfig = {
  state: "selected",
  chip: { label: "Selected And Closed", variant: "success" },
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
  interview_rescheduled: INTERVIEW_RESCHEDULED_CONFIG,
  interview_cancelled: INTERVIEW_CANCELLED_CONFIG,
  rejected: REJECTED_CONFIG,
  selected: SELECTED_CONFIG,
};
