import type { StageData } from "./pipeline-stages.types";

export const PIPELINE_STAGES: StageData[] = [
  { key: "yet-to-start", label: "YET TO START", count: 2, isActive: true },
  { key: "started", label: "STARTED", count: 0 },
  {
    key: "evaluated",
    label: "EVALUATED",
    count: 6,
    subItems: [
      { label: "Passed", count: 4, color: "success" },
      { label: "Failed", count: 2, color: "danger" },
    ],
  },
  { key: "no-show", label: "NO SHOW", count: 1 },
  { key: "archived", label: "ARCHIVED", count: 0 },
];
