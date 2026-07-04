import type { Dispatch, SetStateAction } from "react";
import type { WizardExecutionPayload, HybridQuestionPayload, WizardExecutionSummary } from "@/components/shared/mentions/types";

export type ChatInputProps = {
  mounted?: boolean;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  onSend: () => void;
  onWizardComplete?: (payload: WizardExecutionPayload | HybridQuestionPayload, summary?: WizardExecutionSummary) => void;
  showAurora?: boolean;
};
