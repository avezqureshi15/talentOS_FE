import type { StageData, StageColumn } from "./pipeline-stages.types";

export const SUFFIX_COLUMNS: StageColumn[] = [
  { key: "cv", label: "CV", flex: 0.6 },
  { key: "info", label: "Actions", flex: 2.5 },
];

export const NAME_SCORE_STATUS: StageColumn[] = [
  { key: "name", label: "Candidate", flex: 2 },
  { key: "status", label: "Status", flex: 1 },
];

const NAME_SCORE_VERDICT: StageColumn[] = [
  { key: "name", label: "Candidate", flex: 2 },
  { key: "status", label: "Verdict", flex: 1 },
];

export const PIPELINE_STAGES: StageData[] = [
  { key: "resume-shortlisting", label: "RESUME SHORTLISTING", count: 0, columns: [...NAME_SCORE_VERDICT, ...SUFFIX_COLUMNS] },
  { key: "screening",           label: "SCREENING",            count: 0, columns: [...NAME_SCORE_STATUS, ...SUFFIX_COLUMNS] },
  { key: "interview",           label: "INTERVIEW",            count: 0, columns: [...NAME_SCORE_STATUS, ...SUFFIX_COLUMNS] },
  { key: "waiting-evaluation",  label: "WAITING FOR EVALUATION", count: 0, columns: [...NAME_SCORE_STATUS, { key: "startDate", label: "Start Date", flex: 0.9 }, { key: "time", label: "Time", flex: 0.7 }, ...SUFFIX_COLUMNS] },
  { key: "evaluated",           label: "EVALUATED",             count: 0, columns: [...NAME_SCORE_STATUS, ...SUFFIX_COLUMNS] },
];
