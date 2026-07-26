import type { StageData, StageColumn } from "./pipeline-stages.types";

const NAME_SCORE_INFO: StageColumn[] = [
  { key: "name", label: "Candidate", flex: 2 },
  { key: "score", label: "Score", flex: 0.8 },
  { key: "info", label: "", flex: 0.3 },
];

const NAME_SCORE_STATUS_INFO: StageColumn[] = [
  { key: "name", label: "Candidate", flex: 2 },
  { key: "score", label: "Score", flex: 0.8 },
  { key: "status", label: "Status", flex: 1 },
  { key: "info", label: "", flex: 0.3 },
];

export const PIPELINE_STAGES: StageData[] = [
  { key: "resume-shortlisting", label: "RESUME SHORTLISTING", count: 0, columns: NAME_SCORE_STATUS_INFO },
  { key: "screening",           label: "SCREENING",            count: 0, columns: NAME_SCORE_STATUS_INFO },
  { key: "interview",           label: "INTERVIEW",            count: 0, columns: NAME_SCORE_INFO },
  { key: "waiting-evaluation",  label: "WAITING FOR EVALUATION", count: 0, columns: NAME_SCORE_STATUS_INFO },
  { key: "evaluated",           label: "EVALUATED",             count: 0, columns: NAME_SCORE_STATUS_INFO },
];
