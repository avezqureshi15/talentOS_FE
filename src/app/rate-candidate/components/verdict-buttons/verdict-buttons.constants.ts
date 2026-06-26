export const VERDICT_OPTIONS = [
  { value: "reject" as const, icon: "bx bx-x-circle", label: "Reject", cssClass: "verdict--reject" },
  { value: "hold" as const, icon: "bx bx-timer", label: "Hold", cssClass: "verdict--hold" },
  { value: "advance" as const, icon: "bx bx-check-double", label: "Advance to Next Round", cssClass: "verdict--advance" },
] as const;

export const VERDICT_LABELS = {
  TITLE: "Interviewer Verdict",
} as const;
