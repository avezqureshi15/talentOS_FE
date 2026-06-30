// block-renderer.tsx

import AIMessage from "@/components/ui/ai-message/ai-message";
import ThinkingChip from "./blocks/thinking/thinking";
import ComposeEmail from "./blocks/compose-email/compose-email";
import TextArea from "./blocks/text-area/text-area";
import MarkdownRenderer from "./blocks/markdown/markdown";
import "./block-renderer.css";
import type { RendererMap } from "./block-renderer.types";

export const blockRendererMap: RendererMap = {
  text: (block, key) => (
    <AIMessage key={key} message={block.text} />
  ),

  thinking: (block, key) => (
    <ThinkingChip key={key} text={block.text} />
  ),

  code: (block, key) => (
    <pre key={key} className="block-renderer__code">
      {block.code}
    </pre>
  ),

  image: (block, key) => (
    <img
      key={key}
      src={block.url}
      alt=""
      className="block-renderer__image"
    />
  ),

  email: (_block, key) => (
    <ComposeEmail
      key={key}
    />
  ),

  letter: (block, key) => (
    <TextArea
      key={key}
      subject={block.subject}
      name={block.name}
      meta={block.meta}
    />
  ),

  markdown: (block, key) =>
    <MarkdownRenderer key={key} content={block.content} />,
};