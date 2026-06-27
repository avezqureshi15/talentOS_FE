import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./chat.css";

import ChatArea from "@/app/chat/components/chat-area/chat-area";
import ChatInput from "@/components/ui/chat-input/chat-input";
import EmptyState from "@/app/chat/components/empty-state/empty-state";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";

import { useChatStream } from "@/app/chat/hooks/use-chat-stream";
import { useChatMessages } from "@/app/chat/hooks/use-chat-messages";

import { useChatStore } from "@/store/chat.store";
import { CHAT_BASE_PATH } from "./chat.constants";
import type { WizardExecutionPayload, HybridQuestionPayload } from "@/components/shared/mentions/mentions.types";

export default function Chat() {
  const [input, setInput] = useState(""); // Controlled input value for the chat message field
  const { chatId: paramsChatId } = useParams();

  const {
    hasStarted,
    isProcessing,
    chatId: storeChatId,
    setChatId,
    setMessages,
    messages,
    reset,
  } = useChatStore();

  // Prefer URL param, fall back to store
  const chatId = paramsChatId ?? storeChatId;

  const { isLoading } = useChatMessages(chatId);
  const chatStream = useChatStream();

  // Syncing URL param changes to the store — landing on base page resets to new conversation,
  // navigating to a different chat clears stale messages before new ones load
  useEffect(() => {
    if (!paramsChatId) {
      reset();
    } else if (storeChatId !== paramsChatId) {
      setMessages([]);
      setChatId(paramsChatId);
    }
  }, [paramsChatId]);

  const handleSend = (text: string) => {
    if (!chatId) {
      const newId = crypto.randomUUID();
      setChatId(newId);
      window.history.replaceState(null, "", `${CHAT_BASE_PATH}${newId}`);
      chatStream.mutate({ text, chatId: newId });
    } else {
      chatStream.mutate({ text });
    }
  };

  const handleWizardComplete = (payload: WizardExecutionPayload | HybridQuestionPayload) => {
    handleSend(JSON.stringify(payload));
  };

  const showLoading = chatId && isLoading && messages.length === 0;

  if (showLoading) {
    return (
      <div className="chat-loading">
        <LoadingSpinner size="lg" label="Loading messages..." />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="chat-flex">
        {chatId ? (
          <ChatArea onSend={handleSend} />
        ) : (
          <EmptyState onSuggestionClick={(text) => setInput(text)} />
        )}

        {(hasStarted || !chatId) && (
          <ChatInput
            mounted={false}
            input={input}
            setInput={setInput}
            onSend={() => {
              if (!input.trim() || isProcessing) return;
              handleSend(input);
              setInput("");
            }}
            onWizardComplete={handleWizardComplete}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
