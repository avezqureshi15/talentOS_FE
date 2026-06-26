import type { InterviewRound } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

export type RoundsSidePanelProps = {
  open: boolean;
  round: InterviewRound | null;
  onClose: () => void;
};

export type PanelContentProps = {
  round: InterviewRound;
};

export type RowProps = {
  label: string;
  icon: string;
  value: string;
};
