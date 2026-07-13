export const ROUNDS_PANEL_LABELS = {
  TITLE: "Round Details",
} as const;

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
} as const;
