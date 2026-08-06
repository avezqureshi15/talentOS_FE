export type ReviewPhaseAnswer = {
  question: string;
  score: number;
  notes?: string | null;
};

export type ReviewPhase = {
  phase: string;
  answers: ReviewPhaseAnswer[];
};

export type ReviewPhasesAccordionProps = {
  phases: ReviewPhase[];
  averageRating?: number;
  maxScore?: number;
};
