import { useMutation, useQueryClient } from "@tanstack/react-query";
import { streamChat } from "@/services/ai/chat-stream";
import { useChatStore } from "@/store/chat.store";
import { QUERY_KEYS } from "@/constants/constants";
import { getVisitorId } from "@/utils/visitor";
import type { ContentBlock, StreamInput } from "@/app/chat/pages/chat.types";
import {
  INITIAL_THINKING,
  STEP_TOOL_NAME_LABEL,
  STEP_FALLBACK_LABEL,
  GENERIC_ERROR_MESSAGE,
} from "./use-chat-stream.constants";

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

    mutationFn: async ({ text, chatId: overrideId }: StreamInput) => {
      const baseId = Date.now();
      const aiMessageId = baseId + 1;
      let accumulatedContent = "";
      let currentThinking = INITIAL_THINKING;
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
        switch (step.type) {
          case "tool_name":
            return STEP_TOOL_NAME_LABEL;
          case "tool_args":
            try {
              const parsed = JSON.parse(step.content);
              return parsed.request ?? STEP_FALLBACK_LABEL;
            } catch {
              return STEP_FALLBACK_LABEL;
            }
          default:
            return step.content;
        }
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
          : GENERIC_ERROR_MESSAGE;

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
