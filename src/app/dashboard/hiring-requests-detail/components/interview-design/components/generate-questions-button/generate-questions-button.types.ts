import type { DesignQuestionKind } from "@/services/questions/questions.types";

export interface GenerateQuestionsButtonProps {
  hiringRequestId: string;
  kind: DesignQuestionKind;
  onGenerated: () => void;
}
