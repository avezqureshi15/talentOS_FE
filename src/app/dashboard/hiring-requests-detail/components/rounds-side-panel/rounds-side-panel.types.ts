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
  rejectedStatus: string[];
  rejectedReason?: string;
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
};

export type PanelContentProps = {
  round: RoundDetail;
};

export type RowProps = {
  label: string;
  icon: string;
  value: string;
};

export type ExpandableAiSummaryProps = {
  text: string;
};
