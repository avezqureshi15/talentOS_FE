import type { Message, AIMessage, Suggestion, ContentBlock } from "@/app/chat/pages/chat.types";
import { MOCK_USERS, MOCK_INTERVIEWERS, MOCK_SLOTS } from "@/components/shared/mentions/mock-api";

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
  intent: "INQUIRE_HR_REQUEST" | "INQUIRE_EMPLOYEE" | "INQUIRE_APPLICANT";
  payload: {
    id_field: string;
    name_field: string;
    raw_text_context: string;
  };
};

const ALL_ITEMS = [...MOCK_USERS, ...MOCK_INTERVIEWERS, ...MOCK_SLOTS];

export function resolveRelationalLabel(relationalId: string): string {
  return ALL_ITEMS.find((item) => item.relationalId === relationalId)?.label ?? relationalId;
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
