export type StageKey = "resume-shortlisting" | "screening" | "interview" | "waiting-evaluation" | "evaluated";

export type SubItem = {
  label: string;
  count: number;
  color: "success" | "danger" | "warning" | "info";
};

export type StageColumn = {
  key: string;
  label: string;
  flex: number;
};

export type StageData = {
  key: StageKey;
  label: string;
  count: number;
  subItems?: SubItem[];
  columns: StageColumn[];
};

export type PipelineStagesProps = {
  stages: StageData[];
  activeKey: StageKey;
  onStageChange: (key: StageKey) => void;
};
