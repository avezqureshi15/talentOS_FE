export type StageKey = "resume-shortlisting" | "screening" | "interview" | "waiting-evaluation" | "evaluated" | "outcome";

export type SubItem = {
  label: string;
  count: number;
  color: "success" | "danger" | "warning" | "info";
};

export type StageData = {
  key: StageKey;
  label: string;
  count: number;
  subItems?: SubItem[];
};

export type PipelineStagesProps = {
  stages: StageData[];
  activeKey: StageKey;
  onStageChange: (key: StageKey) => void;
};
