import React from "react";
import { useTypingMarkdown } from "@/app/chat/components/chat-area/block-renderer/blocks/markdown/use-typing-markdown";
import MarkdownRenderer from "@/app/chat/components/chat-area/block-renderer/blocks/markdown/markdown";

type Props = {
  content: string;
  typing?: boolean;
};

const TypingMarkdownRenderer: React.FC<Props> = ({ content, typing = true }) => {
  const typedContent = useTypingMarkdown(content, typing ? 8 : 0);

  return <MarkdownRenderer content={typedContent} />;
};

export default TypingMarkdownRenderer;