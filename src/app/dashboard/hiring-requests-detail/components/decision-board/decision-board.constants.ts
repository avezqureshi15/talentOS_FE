import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";
import type { StageColumn, DecisionStageKey } from "./decision-board.types";

const NAME_SCORE_STATUS_INFO: StageColumn[] = [
  { key: "name", label: "Candidate", flex: 2 },
  { key: "score", label: "Score", flex: 0.8 },
  { key: "status", label: "Status", flex: 1 },
  { key: "cv", label: "CV", flex: 0.6 },
  { key: "timeline", label: "Timeline", flex: 0.6 },
  { key: "info", label: "", flex: 0.4 },
];

export const DECISION_STAGES: { key: DecisionStageKey; label: string; columns: StageColumn[] }[] = [
  { key: "on-hold", label: "ON HOLD", columns: NAME_SCORE_STATUS_INFO },
  { key: "selected", label: "SELECTED", columns: NAME_SCORE_STATUS_INFO },
  { key: "rejected", label: "REJECTED", columns: NAME_SCORE_STATUS_INFO },
];

export const STAGE_FILTER: Record<DecisionStageKey, (a: Applicant) => boolean> = {
  "on-hold": (a) => a.finalVerdict === "on-hold",
  selected: (a) => a.finalVerdict === "selected",
  rejected: (a) => a.finalVerdict === "rejected",
};
