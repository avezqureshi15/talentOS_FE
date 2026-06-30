import type { Message, AIMessage, Suggestion, ContentBlock } from "@/app/chat/pages/chat.types";
import { MOCK_INTERVIEW_LIST } from "@/components/shared/mentions/mock-api";
import { INTENT_LABELS } from "@/components/ui/command-card/command-card.constants";

export function hasSuggestions(
  msg: Message
): msg is AIMessage & { suggestions: Suggestion[] } {
  return msg.role === "ai" && Array.isArray(msg.suggestions);
}

export function hasUIAction(
  msg: Message
): msg is AIMessage & {
  ui_action: { type: "SHOW_JOB_PANEL"; payload: { jobId: string; role: string } };
} {
  return msg.role === "ai" && msg.ui_action?.type === "SHOW_JOB_PANEL";
}

export function extractMarkdown(msg: Message): string {
  if (msg.role !== "ai") return "";
  const block = msg.content.find((b) => b.type === "markdown");
  return block?.content ?? "";
}

export function extractFirstText(blocks: ContentBlock[]): string {
  for (const b of blocks) {
    if (b.type === "text" || b.type === "thinking") {
      return b.text;
    }
  }
  return "";
}

export function extractText(b: ContentBlock): string {
  switch (b.type) {
    case "text":
    case "thinking": return (b as ContentBlock & { text: string }).text;
    case "markdown": return (b as ContentBlock & { content: string }).content;
    case "code": return (b as ContentBlock & { code: string }).code;
    default: return "";
  }
}

export function extractAllText(blocks: ContentBlock[]): string {
  return blocks.map(extractText).filter(Boolean).join("\n\n");
}

export type CommandExecutionData = {
  message_type: "COMMAND_EXECUTION";
  intent: string;
  payload: Record<string, string>;
};

export type HybridQuestionData = {
  message_type: "HYBRID_QUESTION";
  intent: "INQUIRE_HR_REQUEST" | "INQUIRE_EMPLOYEE" | "INQUIRE_APPLICANT" | "INQUIRE_INTERVIEW";
  payload: {
    id_field: string;
    name_field: string;
    raw_text_context: string;
  };
};

export function resolveInterviewStatus(relationalId: string): string | null {
  return MOCK_INTERVIEW_LIST.find((item) => item.relationalId === relationalId)?.meta?.status ?? null;
}

export function isCommandExecution(text: string): boolean {
  try {
    const obj = JSON.parse(text);
    return obj?.message_type === "COMMAND_EXECUTION";
  } catch {
    return false;
  }
}

export function parseCommandExecution(text: string): CommandExecutionData | null {
  try {
    const obj = JSON.parse(text);
    if (obj?.message_type === "COMMAND_EXECUTION") return obj as CommandExecutionData;
    return null;
  } catch {
    return null;
  }
}

export function isHybridQuestion(text: string): boolean {
  try {
    const obj = JSON.parse(text);
    return obj?.message_type === "HYBRID_QUESTION";
  } catch {
    return false;
  }
}

export function parseHybridQuestion(text: string): HybridQuestionData | null {
  try {
    const obj = JSON.parse(text);
    if (obj?.message_type === "HYBRID_QUESTION") return obj as HybridQuestionData;
    return null;
  } catch {
    return null;
  }
}

export function resolveCommandTitle(title: string): string {
  try {
    const obj = JSON.parse(title);
    if (obj?.message_type === "COMMAND_EXECUTION" && obj?.intent) {
      return INTENT_LABELS[obj.intent] ?? obj.intent;
    }
    if (obj?.message_type === "HYBRID_QUESTION" && obj?.intent) {
      return INTENT_LABELS[obj.intent] ?? obj.intent;
    }
  } catch {
  }
  return title;
}
