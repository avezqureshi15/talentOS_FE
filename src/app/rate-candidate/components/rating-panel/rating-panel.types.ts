import type { AnswerMap, ReviewPhase } from "@/app/rate-candidate/services/rate-candidate.types";

export type RubricLevel = {
  score: number;
  icon: string;
  label: string;
  desc: string;
};

export type RatingPanelProps = {
  phases: ReviewPhase[];
  answers: AnswerMap;
  onChangeScore: (key: string, score: number) => void;
  onChangeNotes: (key: string, notes: string) => void;
  levels: RubricLevel[];
  notesMaxChars: number;
};
