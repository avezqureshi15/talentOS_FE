import type { InterviewTimeStatus } from "../../interview-design.types";

export interface InterviewDesignHeaderProps {
  totalMinutes: number;
  targetMinutes: number;
  timeStatus: InterviewTimeStatus;
  questionCount: number;
  isSaving: boolean;
  onSave: () => void;
  onClose: () => void;
}
