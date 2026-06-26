import type { Message, AIMessage, Suggestion, ContentBlock } from "@/app/chat/pages/chat.types";

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
