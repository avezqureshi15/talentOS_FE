export const ROUNDS_PANEL_LABELS = {
  TITLE: "Interview Details",
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
  approved: "Approved",
  rejected: "Rejected",
};

export const ROUNDS_FALLBACK = {
  NO_NOTES: "No notes provided.",
} as const;
