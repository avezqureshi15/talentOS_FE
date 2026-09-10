import type {
  InterviewPlanQuestion,
  InterviewPlanSection,
} from "../../interview-design.types";

export interface SectionDetailEditorProps {
  section: InterviewPlanSection;
  maxQuestionMinutes: number;
  hideMinutes?: boolean;
  minQuestionMinutes?: number;
  questionMinutesStep?: number;
  onUpdateSection: (patch: Partial<Omit<InterviewPlanSection, "id" | "questions">>) => void;
  onDeleteSection: () => void;
  onAddQuestion: () => void;
  onUpdateQuestion: (questionId: string, patch: Partial<Omit<InterviewPlanQuestion, "id">>) => void;
  onDeleteQuestion: (questionId: string) => void;
  onDuplicateQuestion: (questionId: string) => void;
  onMoveQuestion: (activeId: string, overId: string) => void;
}
