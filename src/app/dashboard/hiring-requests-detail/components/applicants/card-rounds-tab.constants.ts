export const VERDICT_CONFIG: Record<string, string> = {
  selected: "Selected",
  rejected: "Rejected",
  hold: "On Hold",
  advance: "Advanced",
  pending: "Pending",
  shortlisted: "Shortlisted",
};

export const VERDICT_CHIP_VARIANT: Record<string, "success" | "danger" | "warning" | "info" | "neutral" | "yellow"> = {
  selected: "success",
  shortlisted: "success",
  advance: "success",
  rejected: "danger",
  hold: "warning",
  pending: "neutral",
};

export const ROUNDS_TAB_LABELS = {
  SECTION_TITLE: "Rounds",
  COL_ROUND: "Round name",
  COL_DECISION: "Decision",
  NO_VERDICT: "Pending",
} as const;
