export type ScheduleStep = 1 | 2 | 3;

export type Interviewer = {
  id: string;
  name: string;
  role: string;
};

export type SlotStatus = "available" | "unavailable";

export type TimeSlot = {
  time: string;
  status: SlotStatus;
};

export type DaySchedule = {
  day: string;
  date: string;
  slots: TimeSlot[];
};

export type ScheduleRoundModalProps = {
  open: boolean;
  candidateName: string;
  candidateId: string;
  onClose: () => void;
  onScheduled: (candidateId: string) => void;
};
