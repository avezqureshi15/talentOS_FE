import React from "react";
import type { CodeBlock, EmailBlock, ImageBlock, LetterBlock, MarkdownBlock, TextBlock, ThinkingBlock } from "@/app/chat/pages/chat.types";

export type BlockExtraProps = {
  isEditing?: boolean;
  onSave?: (content: string) => void;
  onEditRequest?: () => void;
};

export type RendererMap = {
  text: (block: TextBlock, key: number, extra?: BlockExtraProps) => React.ReactNode;
  thinking: (block: ThinkingBlock, key: number, extra?: BlockExtraProps) => React.ReactNode;
  code: (block: CodeBlock, key: number, extra?: BlockExtraProps) => React.ReactNode;
  image: (block: ImageBlock, key: number, extra?: BlockExtraProps) => React.ReactNode;
  email: (block: EmailBlock, key: number, extra?: BlockExtraProps) => React.ReactNode;
  letter: (block: LetterBlock, key: number, extra?: BlockExtraProps) => React.ReactNode;
  markdown: (block: MarkdownBlock, key: number, extra?: BlockExtraProps) => React.ReactNode;
};
