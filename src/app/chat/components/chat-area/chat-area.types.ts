export type { TextBlock, ThinkingBlock, CodeBlock, ImageBlock, EmailBlock, LetterBlock, MarkdownBlock, ContentBlock } from "@/app/chat/pages/chat.types";

export type ChatAreaProps = {
  onSend: (text: string) => void;
};
