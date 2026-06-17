import type { ContentBlock } from "../pages/chat.type";
import {
  formatToolName,
  streamChat,
  streamStepToContentBlock,
} from "../../../services/chat/chatStream";
import { useChatStore } from "../../../store/chat.store";

const createThreadId = () => crypto.randomUUID();

export const processUserMessage = async (text: string, _depth: number) => {
  const {
    addMessage,
    updateMessage,
    setStarted,
    threadId,
    setThreadId,
    setStreaming,
    isStreaming,
  } = useChatStore.getState();

  if (isStreaming) return;

  setStarted();
  setStreaming(true);

  const currentThreadId = threadId ?? createThreadId();
  if (!threadId) {
    setThreadId(currentThreadId);
  }

  const baseId = Date.now();

  addMessage({
    id: baseId,
    role: "user",
    content: [{ type: "text", text }],
  });

  const id = baseId + 1;

  addMessage({
    id,
    role: "ai",
    content: [{ type: "thinking", text: "Thinking..." }],
  });

  let thinkingText = "Thinking...";
  let showThinking = true;

  let markdownContent = "";
  let textContent = "";
  let hasFinalContent = false;

  let pendingMarkdown = "";
  let pendingText = "";
  let revealTimer: number | null = null;
  let revealDoneResolve: (() => void) | null = null;
  const revealDone = new Promise<void>((resolve) => {
    revealDoneResolve = resolve;
  });

  const setAiContent = (content: ContentBlock[]) => {
    updateMessage(id, (m) => ({
      ...m,
      content,
    }));
  };

  const startRevealLoop = () => {
    if (revealTimer != null) return;

    const tick = () => {
      const hasPending = pendingMarkdown.length > 0 || pendingText.length > 0;
      if (!hasPending) {
        if (revealTimer != null) {
          window.clearInterval(revealTimer);
          revealTimer = null;
        }
        revealDoneResolve?.();
        return;
      }

      if (pendingMarkdown.length > 0) {
        const slice = pendingMarkdown.slice(0, 2);
        pendingMarkdown = pendingMarkdown.slice(2);
        markdownContent += slice;
      } else if (pendingText.length > 0) {
        const slice = pendingText.slice(0, 2);
        pendingText = pendingText.slice(2);
        textContent += slice;
      }

      rebuildContent();
    };

    tick();
    revealTimer = window.setInterval(tick, 30);
  };

  const rebuildContent = () => {
    const blocks: ContentBlock[] = [];

    if (showThinking) {
      blocks.push({ type: "thinking", text: thinkingText });
    }

    if (markdownContent) {
      blocks.push({ type: "markdown", content: markdownContent });
    } else if (textContent) {
      blocks.push({ type: "text", text: textContent });
    }

    if (!blocks.length) {
      blocks.push({ type: "thinking", text: "Thinking..." });
    }

    setAiContent(blocks);
  };

  try {
    await streamChat(text, currentThreadId, {
      onChunk: (chunk) => {
        for (const step of chunk.steps) {
          if (step.type === "tool_name") {
            thinkingText = formatToolName(step.content);
            rebuildContent();
          }
        }

        for (const block of chunk.final) {
          const contentBlock = streamStepToContentBlock(block);
          if (!contentBlock) continue;

          if (contentBlock.type === "markdown") {
            hasFinalContent = true;
            showThinking = false;
            pendingMarkdown += contentBlock.content;
            startRevealLoop();
          } else if (contentBlock.type === "text") {
            hasFinalContent = true;
            showThinking = false;
            pendingText += contentBlock.text;
            startRevealLoop();
          }
        }
      },
      onError: (error) => {
        setAiContent([{ type: "text", text: `Error: ${error.message}` }]);
      },
    });

    if (!hasFinalContent) {
      setAiContent([
        { type: "text", text: "No response received from the assistant." },
      ]);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    setAiContent([{ type: "text", text: `Error: ${message}` }]);
  } finally {
    if (revealTimer != null) {
      await revealDone;
    } else if (pendingMarkdown.length || pendingText.length) {
      markdownContent += pendingMarkdown;
      textContent += pendingText;
      pendingMarkdown = "";
      pendingText = "";
      rebuildContent();
    }
    setStreaming(false);
    useChatStore.getState().saveConversation();
  }
};
