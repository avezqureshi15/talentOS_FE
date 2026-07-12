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
  ratings: { label: string; score: number; maxScore: number; entityType?: string }[];
  skills: string[];
  notes: string;
  aiSummary: string;
  strongMatches: string[];
  gapsAndConcerns: string[];
  verdict?: "reject" | "hold" | "advance";
  aiDecision?: "pending" | "selected" | "rejected" | "conflict";
  hrDecision?: "pending" | "shortlisted" | "rejected";
  remarksHr?: string;
  rejectedStatus: string[];
  rejectedReason?: string;
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
