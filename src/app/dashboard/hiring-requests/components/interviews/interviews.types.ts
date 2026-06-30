export type InterviewEntity = {
  id: string;
  interviewerName: string;
  candidateName: string;
  candidateId: string;
  hiringRequestId: string;
  position: string;
  slotTime: string;
  slotDate: string;
  roomLink: string;
};

export type InterviewSubTab = "incoming" | "completed";

export type InterviewCardProps = {
  interview: InterviewEntity;
  isOpen: boolean;
  onToggleOpen: (id: string) => void;
  onReschedule: (candidateName: string, candidateId: string) => void;
  onCancel: (candidateName: string) => void;
  onNavigateToApplicant: (hiringRequestId: string, candidateId: string) => void;
};
