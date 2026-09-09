import type { FinalVerdictSubTab } from "./final-verdict.types";

export const FINAL_VERDICT_SUB_TABS: { key: FinalVerdictSubTab; label: string; apiStatus: string }[] = [
  { key: "selected", label: "Selected", apiStatus: "selected" },
  { key: "rejected", label: "Rejected", apiStatus: "rejected" },
  { key: "on-hold", label: "On Hold", apiStatus: "on_hold" },
];

export const FINAL_VERDICT_API_STATUS: Record<FinalVerdictSubTab, string> = {
  selected: "selected",
  rejected: "rejected",
  "on-hold": "on_hold",
};
