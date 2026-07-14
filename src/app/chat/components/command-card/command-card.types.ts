import type { CommandExecutionData, HybridQuestionData } from "@/app/chat/components/chat-area/chat-area.utils";

export type CommandCardProps = {
  data?: CommandExecutionData;
  hybrid?: HybridQuestionData;
};
