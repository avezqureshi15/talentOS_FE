export type ComparisonField = {
  label: string;
  actual: string;
  expected: string;
};

export type ReviewPhaseAnswer = {
  question: string;
  score: number;
  notes?: string | null;
};

export type ReviewPhase = {
  phase: string;
  answers: ReviewPhaseAnswer[];
};

export type ReviewEntity = {
  entityType: string;
  verdict?: string;
  ratings: { label: string; score: number; maxScore: number }[];
  skills: string[];
  notes: string;
  summary?: string;
  strongMatches: string[];
  gapsAndConcerns: string[];
  remarks?: string;
  rejectionDetails: Array<Record<string, { JD: string; Candidate: string }>>;
  comparisonFields: ComparisonField[];
  averageRating?: number;
  phases: ReviewPhase[];
  questionsSource?: string;
};

export type RoundDetail = {
  id: string;
  round: string;
  interviewer: string;
  interviewers: string[];
  role: string;
  jdLabel: string;
  candidate: string;
  occurredOn: string;
  slot: string;
  duration: string;
  interviewType: string;
  status: string;
  hasInterview: boolean;
  reviewFormStatus: string | null;
  reviews: ReviewEntity[];
};

export type RoundInfoRow = {
  label: string;
  icon: string;
  value: string;
};

export type RoundsSidePanelProps = {
  open: boolean;
  roundId: string | null;
  onClose: () => void;
  hideReviews?: boolean;
};

export type PanelContentProps = {
  round: RoundDetail;
  hideReviews?: boolean;
};

export type RowProps = {
  label: string;
  icon: string;
  value: string;
};

export type ExpandableAiSummaryProps = {
  text: string;
};
