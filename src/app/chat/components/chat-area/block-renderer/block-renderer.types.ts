import React from "react";
import type { CodeBlock, EmailBlock, ImageBlock, LetterBlock, MarkdownBlock, TextBlock, ThinkingBlock } from "@/app/chat/pages/chat.types";

export type RendererMap = {
  text: (block: TextBlock, key: number) => React.ReactNode;
  thinking: (block: ThinkingBlock, key: number) => React.ReactNode;
  code: (block: CodeBlock, key: number) => React.ReactNode;
  image: (block: ImageBlock, key: number) => React.ReactNode;
  email: (block: EmailBlock, key: number) => React.ReactNode;
  letter: (block: LetterBlock, key: number) => React.ReactNode;
  markdown: (block: MarkdownBlock, key: number) => React.ReactNode;
};
