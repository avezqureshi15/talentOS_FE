import { useMutation } from "@tanstack/react-query";
import { streamChat } from "@/services/ai/chat-stream";
import { useChatStore } from "@/store/chat.store";
import { QUERY_KEYS } from "@/constants/constants";

let threadId = `thread_${Date.now()}`;

export const resetThread = () => {
  threadId = `thread_${Date.now()}`;
};

export const useChatStream = () => {
  const {
    addMessage,
    updateMessage,
    setStarted,
    setProcessing,
    setError,
  } = useChatStore();

  return useMutation({
    mutationKey: [QUERY_KEYS.CHAT_STREAM],

    mutationFn: async ({
      text,
    }: {
      text: string;
    }) => {
      const baseId = Date.now();
      const aiMessageId = baseId + 1;

      setProcessing(true);
      setError(null);
      setStarted();

      // 1. Add user message
      addMessage({
        id: baseId,
        role: "user",
        content: [{ type: "text", text }],
      });

      // 2. Add placeholder AI message
      addMessage({
        id: aiMessageId,
        role: "ai",
        content: [{ type: "thinking", text: "Analyzing your request..." }],
      });

      let accumulatedContent = "";

      const formatStepText = (step: { type: string; content: string }): string => {
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

      await streamChat(text, threadId, {
        onStep: (step) => {
          updateMessage(aiMessageId, (m) => ({
            ...m,
            content: [
              { type: "thinking" as const, text: formatStepText(step) },
            ],
          }));
        },

        onFinal: (block) => {
          accumulatedContent += block.content;

          updateMessage(aiMessageId, (m) => ({
            ...m,
            content: [{
              type: "markdown" as const,
              content: accumulatedContent,
            }],
          }));
        },

        onError: (err) => {
          setError(err.message);
        },
      });

      // 3. Final update with all accumulated content
      if (accumulatedContent) {
        updateMessage(aiMessageId, (m) => ({
          ...m,
          content: [{
            type: "markdown" as const,
            content: accumulatedContent,
          }],
        }));
      }
    },

    onError: (err) => {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";

      setError(errorMessage);

      const baseId = Date.now();

      addMessage({
        id: baseId,
        role: "ai",
        content: [{ type: "text", text: errorMessage }],
      });
    },

    onSettled: () => {
      setProcessing(false);
    },
  });
};
