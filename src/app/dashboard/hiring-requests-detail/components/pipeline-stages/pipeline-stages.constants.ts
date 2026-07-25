import type { StageData } from "./pipeline-stages.types";

export const PIPELINE_STAGES: StageData[] = [
  { key: "resume-shortlisting", label: "RESUME SHORTLISTING", count: 0 },
  { key: "screening",           label: "SCREENING",            count: 0 },
  { key: "interview",           label: "INTERVIEW",            count: 0 },
  { key: "waiting-evaluation",  label: "WAITING FOR EVALUATION", count: 0 },
  { key: "evaluated",           label: "EVALUATED",             count: 0 },
  { key: "outcome",             label: "OUTCOME",               count: 0 },
];
