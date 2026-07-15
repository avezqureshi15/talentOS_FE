export type ScheduleStep = 1 | 2 | 3;

export type Interviewer = {
  id: string;
  emp_id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  slots_count: number;
  has_slots: boolean;
};

export type SlotTab = {
  id: string;
  label: string;
};

export type ScheduleRoundModalProps = {
  open: boolean;
  candidateName: string;
  candidateId: string;
  candidateNumberId?: number;
  jdId?: string;
  interviewId?: string;
  interviewerEmpId?: string;
  interviewerName?: string;
  roundName?: string;
  rescheduleMode?: boolean;
  onClose: () => void;
  onScheduled: (candidateId: string) => void;
};
