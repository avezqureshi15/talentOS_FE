export const ROUNDS_PANEL_LABELS = {
  TITLE: "Round Details",
} as const;

export const ROUNDS_PANEL_STATUS = {
  ERROR: "Failed to load round details.",
  RETRY: "Retry",
} as const;

export const VERDICT_LABELS: Record<string, string> = {
  reject: "Rejected",
  hold: "On Hold",
  advance: "Advanced",
};

export const AI_LABELS: Record<string, string> = {
  pending: "Pending",
  selected: "Selected",
  rejected: "Rejected",
  conflict: "Conflict",
};

export const HR_LABELS: Record<string, string> = {
  pending: "Pending",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
};

export const READ_MORE_LENGTH = 120;
export const AI_SUMMARY_MAX_LENGTH = 300;

export const VERDICT_ICONS: Record<string, string> = {
  reject: "bx bx-x-circle",
  hold: "bx bx-clockr",
  advance: "bx bx-check-double",
};

export const AI_ICONS: Record<string, string> = {
  pending: "bx bx-hourglass",
  selected: "bx bx-check-circle",
  rejected: "bx bx-x-circle",
  conflict: "bx bx-error",
};

export const HR_ICONS: Record<string, string> = {
  pending: "bx bx-hourglass",
  shortlisted: "bx bx-check-circle",
  rejected: "bx bx-x-circle",
};

export const HR_REMARKS_LABEL = "HR Remarks";

export const ROUNDS_FALLBACK = {
  NO_NOTES: "No notes provided.",
  NO_AI_SUMMARY: "No AI summary available.",
} as const;
