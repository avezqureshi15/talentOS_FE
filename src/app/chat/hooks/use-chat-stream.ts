import { useMutation, useQueryClient } from "@tanstack/react-query";
import { streamChat } from "@/services/ai/chat-stream";
import { useChatStore } from "@/store/chat.store";
import { QUERY_KEYS } from "@/constants/constants";
import type { ContentBlock, StreamInput } from "@/app/chat/pages/chat.types";
import {
  INITIAL_THINKING,
  GENERIC_ERROR_MESSAGE,
} from "./use-chat-stream.constants";

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

      let toolArgsAccumulator = "";
      let extractedRequest: string | null = null;
      let responseContent = "";
      let responseUI: string | undefined;

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
        content: [{ type: "thinking", text: INITIAL_THINKING }],
      });

      const buildContent = (): ContentBlock[] => {
        const blocks: ContentBlock[] = [
          { type: "thinking", text: extractedRequest || INITIAL_THINKING },
        ];
        if (responseContent) {
          blocks.push({ type: "markdown", content: responseContent, ui: responseUI });
        }
        return blocks;
      };

      try {
        const effectiveChatId = overrideId ?? chatId;
        await streamChat(text, effectiveChatId, {
          onChatId: (id) => {
            setChatId(id);
          },

          onStep: (step) => {
            if (step.type === "tool_args") {
              toolArgsAccumulator += step.content;
              try {
                const parsed = JSON.parse(toolArgsAccumulator);
                if (parsed?.request) {
                  extractedRequest = parsed.request;
                }
              } catch {
                // JSON not yet complete
              }
            }
            updateMessage(aiMessageId, (m) => ({
              ...m,
              content: buildContent(),
            }));
          },

          onFinal: (block) => {
            responseContent += block.content;
            if (block.ui) responseUI = block.ui;
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
