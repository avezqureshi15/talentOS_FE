import type { FinalVerdictSubTab } from "./final-verdict.types";

export const FINAL_VERDICT_SUB_TABS: { key: FinalVerdictSubTab; label: string; icon: string }[] = [
  { key: "selected", label: "Selected", icon: "bx bx-check-circle" },
  { key: "rejected", label: "Rejected", icon: "bx bx-x-circle" },
];
