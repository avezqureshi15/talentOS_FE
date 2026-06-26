export type RubricLevel = {
  score: number;
  icon: string;
  label: string;
  desc: string;
};

export type RatingCriterion = {
  key: string;
  label: string;
};

export type RatingPanelProps = {
  criteria: RatingCriterion[];
  ratings: Record<string, number>;
  onChangeRating: (key: string, value: number) => void;
  levels: RubricLevel[];
};
