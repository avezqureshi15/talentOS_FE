import type { StageData } from "./pipeline-stages.types";

export const PIPELINE_STAGES: StageData[] = [
  { key: "yet-to-start", label: "YET TO START", count: 2 },
  { key: "started", label: "STARTED", count: 0 },
  {
    key: "evaluated",
    label: "EVALUATED",
    count: 6,
    subItems: [
      { label: "Completed", count: 4, color: "success" },
      { label: "Partially Completed", count: 2, color: "warning" },
    ],
  },
  { key: "no-show", label: "NO SHOW", count: 1 },
  { key: "archived", label: "ARCHIVED", count: 0 },
];
