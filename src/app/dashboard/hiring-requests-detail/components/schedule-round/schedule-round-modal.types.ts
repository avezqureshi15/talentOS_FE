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

export type ScreeningQuestion = {
  id: string;
  question: string;
};

export type InterviewQuestion = {
  id: string;
  question: string;
  score: number;
  expected_points?: string[];
};

export type ScreeningRoundConfig = {
  voice_screening_enabled: boolean;
  screening_questions: ScreeningQuestion[];
  screening_call_from: string | null;
  screening_call_to: string | null;
  screening_timezone: string;
};

export type InterviewRoundConfig = {
  interview_questions: InterviewQuestion[];
  interview_total_score: number;
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
  hiringRequestId?: string;
  onClose: () => void;
  onScheduled: (candidateId: string) => void;
};


