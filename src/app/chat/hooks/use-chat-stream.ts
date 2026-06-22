import { useMutation } from "@tanstack/react-query";
import { streamChat } from "@/services/ai/chat-stream";
import { useChatStore } from "@/store/chat.store";
import { QUERY_KEYS } from "@/constants/constants";
import { getVisitorId } from "@/utils/visitor";
import type { ContentBlock } from "@/app/chat/pages/chat.types";

const visitorId = getVisitorId();

const PHRASE_INTERVAL_MS = 600;

const splitPhrases = (text: string): string[] => {
  const parts = text.split(/(?<=[.,!?;:])\s*/);
  return parts.filter((p) => p.trim().length > 0);
};

export const useChatStream = () => {
  const {
    addMessage,
    updateMessage,
    setStarted,
    setProcessing,
    setError,
    setChatId,
    chatId,
  } = useChatStore();

  return useMutation({
    mutationKey: [QUERY_KEYS.CHAT_STREAM],

    mutationFn: async ({ text, chatId: overrideId }: { text: string; chatId?: string | null }) => {
      const baseId = Date.now();
      const aiMessageId = baseId + 1;
      let accumulatedContent = "";
      let thinkingBuffer = "";
      let emittedPhrases = 0;

      setProcessing(true);
      setError(null);
      setStarted();

      addMessage({
        id: baseId,
        role: "user",
        content: [{ type: "text", text }],
      });

      addMessage({
        id: aiMessageId,
        role: "ai",
        content: [{ type: "thinking", text: "Analyzing your request..." }],
      });

      const buildContent = (thinking: string): ContentBlock[] => {
        const blocks: ContentBlock[] = [{ type: "thinking", text: thinking }];
        if (accumulatedContent) {
          blocks.push({ type: "markdown", content: accumulatedContent });
        }
        return blocks;
      };

      const flushThinking = () => {
        const phrases = splitPhrases(thinkingBuffer);
        if (phrases.length > emittedPhrases) {
          const latest = phrases[phrases.length - 1].trim();
          if (latest.length > 0) {
            emittedPhrases = phrases.length;
            updateMessage(aiMessageId, (m) => ({
              ...m,
              content: buildContent(latest),
            }));
          }
        }
      };

      const thinkingTimer = setInterval(flushThinking, PHRASE_INTERVAL_MS);

      const formatStepText = (step: {
        type: string;
        content: string;
      }): string => {
        if (step.type === "tool_name") {
          return "Processing your request...";
        }
        if (step.type === "tool_args") {
          try {
            const parsed = JSON.parse(step.content);
            return parsed.request ?? "Analyzing...";
          } catch {
            return "Analyzing...";
          }
        }
        return step.content;
      };

      try {
        const effectiveChatId = overrideId ?? chatId;
        await streamChat(text, effectiveChatId, visitorId, {
          onChatId: (id) => {
            setChatId(id);
          },

          onStep: (step) => {
            updateMessage(aiMessageId, (m) => ({
              ...m,
              content: buildContent(formatStepText(step)),
            }));
          },

          onFinal: (block) => {
            accumulatedContent += block.content;
            thinkingBuffer += block.content;
          },

          onError: (err) => {
            setError(err.message);
          },
        });
      } finally {
        clearInterval(thinkingTimer);
      }

      if (accumulatedContent) {
        updateMessage(aiMessageId, (m) => ({
          ...m,
          content: [{ type: "markdown" as const, content: accumulatedContent }],
        }));
      }
    },

    onError: (err) => {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";

      setError(errorMessage);

      addMessage({
        id: Date.now(),
        role: "ai",
        content: [{ type: "text", text: errorMessage }],
      });
    },

    onSettled: () => {
      setProcessing(false);
    },
  });
};
