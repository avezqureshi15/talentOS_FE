import type { ComparisonField } from "@/utils/review-comparison/review-comparison.utils.types";

export type { ComparisonField };

export type ReviewAnswerItem = {
  question: string;
  score: number;
  notes?: string | null;
};

export type ReviewAnswerPhase = {
  phase: string;
  answers: ReviewAnswerItem[];
};

export type ReviewEntity = {
  entityType: string;
  verdict?: string;
  ratings: { label: string; score: number; maxScore: number }[];
  phases: ReviewAnswerPhase[];
  skills: string[];
  notes: string;
  summary?: string;
  strongMatches: string[];
  gapsAndConcerns: string[];
  remarks?: string;
  rejectionDetails: Array<Record<string, { JD: string; Candidate: string }>>;
  comparisonFields: ComparisonField[];
  averageRating?: number;
  [key: string]: unknown;
};

export type RoundDetail = {
  id: string;
  round: string;
  interviewer: string;
  role: string;
  jdLabel: string;
  candidate: string;
  occurredOn: string;
  slot: string;
  duration: string;
  interviewType: string;
  status: string;
  reviews: ReviewEntity[];
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
