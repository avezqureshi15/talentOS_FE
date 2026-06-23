// render-block.ts

import type { ContentBlock } from "@/app/chat/pages/chat.types";
import { blockRendererMap } from "./block-renderer";

export const renderBlock = (block: ContentBlock, key: number) => {
  switch (block.type) {
    case "text":
      return blockRendererMap.text(block, key);

    case "thinking":
      return blockRendererMap.thinking(block, key);

    case "code":
      return blockRendererMap.code(block, key);

    case "image":
      return blockRendererMap.image(block, key);

    case "email":
      return blockRendererMap.email(block, key);

    case "letter":
      return blockRendererMap.letter(block, key);

    case "markdown":
      return blockRendererMap.markdown(block, key);

    default:
      return null;
  }
};