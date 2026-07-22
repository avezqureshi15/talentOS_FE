export type SubItem = {
  label: string;
  count: number;
  color: "success" | "danger" | "warning" | "info";
};

export type StageData = {
  key: string;
  label: string;
  count: number;
  isActive?: boolean;
  subItems?: SubItem[];
};

export type PipelineStagesProps = {
  stages: StageData[];
};
