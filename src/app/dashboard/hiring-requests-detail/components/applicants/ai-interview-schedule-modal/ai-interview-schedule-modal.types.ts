export type AiInterviewScheduleModalProps = {
  open: boolean;
  candidateName: string;
  candidateId: number;
  hiringRequestId: string;
  currentSlot?: string | null;
  onClose: () => void;
  onScheduled: () => void;
};