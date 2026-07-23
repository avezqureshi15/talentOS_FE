// render-block.ts

import type { ContentBlock } from "@/app/chat/pages/chat.types";
import type { BlockExtraProps } from "./block-renderer.types";
import { blockRendererMap } from "./block-renderer";

export const renderBlock = (block: ContentBlock, key: number, extra?: BlockExtraProps) => {
  switch (block.type) {
    case "text":
      return blockRendererMap.text(block, key, extra);

    case "thinking":
      return blockRendererMap.thinking(block, key, extra);

    case "code":
      return blockRendererMap.code(block, key, extra);

    case "image":
      return blockRendererMap.image(block, key, extra);

    case "email":
      return blockRendererMap.email(block, key, extra);

    case "letter":
      return blockRendererMap.letter(block, key, extra);

    case "markdown":
      console.log("Block",block)
      return blockRendererMap.markdown(block, key, extra);

    default:
      return null;
  }
};