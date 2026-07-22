export type Recruiter = {
  id: string;
  name: string;
  count: number;
};

export type ViewMode = "table" | "card";

export type RecruiterFilterProps = {
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
};
