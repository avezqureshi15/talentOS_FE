export const ROUNDS_PANEL_LABELS = {
  TITLE: "Round Details",
  ROUND_INFO: "Round info",
  DECISIONS: "Decisions & Reviews",
  INTERVIEWERS: "Interviewer(s)",
  CANDIDATE: "Candidate",
  HIRING_ROLE: "Hiring Role",
  SCHEDULED_FOR: "Scheduled for",
  DURATION: "Duration",
  INTERVIEW_STATUS: "Interview status",
  REVIEW_STATUS: "Review status",
  SCREENED_ON: "Screened on",
  STATUS: "Status",
} as const;

export const INTERVIEW_STATUS_LABELS: Record<string, string> = {
  Scheduled: "Interview scheduled",
  "In progress": "Interview in progress",
  Completed: "Interview completed",
  Cancelled: "Interview cancelled",
};

export const REVIEW_FORM_STATUS_LABELS: Record<string, string> = {
  awaiting: "Awaiting review",
  received: "Review received",
  expired: "Review link expired",
};

export const COMPLETED_WITH_REVIEW_LABELS: Record<string, string> = {
  awaiting: "Interview completed · Awaiting review",
  received: "Interview completed · Review received",
  expired: "Interview completed · Review link expired",
};

export const ROUNDS_PANEL_STATUS = {
  ERROR: "Failed to load round details.",
  RETRY: "Retry",
} as const;

export const VERDICT_LABELS: Record<string, string> = {
  selected: "Selected",
  rejected: "Rejected",
  shortlisted: "Shortlisted",
  pending: "Pending",
};

export const VERDICT_ICONS: Record<string, string> = {
  selected: "bx bx-check-circle",
  rejected: "bx bx-x-circle",
  shortlisted: "bx bx-check-circle",
  pending: "bx bx-hourglass",
};

export const ENTITY_TITLE_LABELS: Record<string, string> = {
  interviewer: "Interviewer Review",
  ai: "AI Assessment",
  hr: "HR Decision",
};

export const RATING_LABELS: Record<string, string> = {
  communication: "Communication",
  technical_skills: "Technical Skills",
  problem_solving: "Problem Solving",
  cultural_fit: "Cultural Fit",
};

export const READ_MORE_LENGTH = 120;
export const AI_SUMMARY_MAX_LENGTH = 300;

export const ROUNDS_FALLBACK = {
  NO_NOTES: "No notes provided.",
  NO_AI_SUMMARY: "No AI summary available.",
  NO_FULL_REVIEW: "No detailed review answers available.",
  VIEW_FULL_REVIEW: "View full review",
  HIDE_FULL_REVIEW: "Hide full review",
} as const;

export const CRITERION_LABELS: Record<string, string> = {
  YOE: "Years of Experience",
  BUDGET: "Budget",
  LOCATION: "Location",
  NOTICE_PERIOD: "Notice Period",
};

export const COMPARISON_LABELS: Record<string, string> = {
  YOE: "Years of Experience",
  CTC: "Current CTC",
  LOCATION: "Location",
  NOTICE_PERIOD: "Notice Period",
};
