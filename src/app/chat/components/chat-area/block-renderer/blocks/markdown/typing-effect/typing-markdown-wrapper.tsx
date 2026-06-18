import React from "react";
import { useTypingMarkdown } from "../use-typing-markdown";
import MarkdownRenderer from "../markdown";

type Props = {
  content: string;
  typing?: boolean;
};

const TypingMarkdownRenderer: React.FC<Props> = ({ content, typing = true }) => {
  const typedContent = useTypingMarkdown(content, typing ? 8 : 0);

  return <MarkdownRenderer content={typedContent} />;
};

export default TypingMarkdownRenderer;