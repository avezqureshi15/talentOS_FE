import { useMutation, useQueryClient } from "@tanstack/react-query";
import { streamChat } from "@/services/ai/chat-stream";
import { useChatStore } from "@/store/chat.store";
import { QUERY_KEYS } from "@/constants/constants";
import { getVisitorId } from "@/utils/visitor";
import type { ContentBlock } from "@/app/chat/pages/chat.types";

const visitorId = getVisitorId();

export const useChatStream = () => {
  const queryClient = useQueryClient();
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
      let currentThinking = "Analyzing your request...";
      let hasFinalContent = false;

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
        content: [{ type: "thinking", text: currentThinking }],
      });

      const buildContent = (): ContentBlock[] => {
        const blocks: ContentBlock[] = [{ type: "thinking", text: currentThinking }];
        if (accumulatedContent) {
          blocks.push({ type: "markdown", content: accumulatedContent });
        }
        return blocks;
      };

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
            currentThinking = formatStepText(step);
            updateMessage(aiMessageId, (m) => ({
              ...m,
              content: buildContent(),
            }));
          },

          onFinal: (block) => {
            accumulatedContent += block.content;
            hasFinalContent = true;
            updateMessage(aiMessageId, (m) => ({
              ...m,
              content: buildContent(),
            }));
          },

          onError: (err) => {
            setError(err.message);
          },
        });
      } finally {
        // no-op
      }

      if (hasFinalContent) {
        updateMessage(aiMessageId, (m) => ({
          ...m,
          content: [{ type: "markdown" as const, content: accumulatedContent }],
        }));
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHAT_HISTORY] });
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
