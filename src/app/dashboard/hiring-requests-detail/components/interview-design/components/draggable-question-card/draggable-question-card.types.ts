import type { InterviewPlanQuestion } from "../../interview-design.types";

export interface DraggableQuestionCardProps {
  question: InterviewPlanQuestion;
  maxMinutes: number;
  onUpdate: (patch: Partial<Omit<InterviewPlanQuestion, "id">>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}
