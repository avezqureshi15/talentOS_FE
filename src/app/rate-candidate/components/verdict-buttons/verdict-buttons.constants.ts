export const VERDICT_OPTIONS = [
  { value: "selected" as const, icon: "bx bx-check-circle", label: "Selected", cssClass: "verdict--selected" },
  { value: "rejected" as const, icon: "bx bx-x-circle", label: "Rejected", cssClass: "verdict--rejected" },
] as const;

export const VERDICT_LABELS = {
  TITLE: "Interviewer Verdict",
} as const;
