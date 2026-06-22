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

export default function Chat() {
  const [input, setInput] = useState("");
  const { chatId } = useParams();

  const { hasStarted, isProcessing, setChatId, setMessages, reset } = useChatStore();
  const { isLoading } = useChatMessages();
  const chatStream = useChatStream();

  // Reset store when navigating to a new chat or between different chats
  useEffect(() => {
    if (!chatId) {
      reset();
    } else {
      setChatId(chatId);
      setMessages([]);
    }
  }, [chatId]);

  const handleSend = (text: string) => {
    chatStream.mutate({ text });
  };

  if (chatId && isLoading) {
    return (
      <div className="chat-loading">
        <LoadingSpinner size="lg" label="Loading messages..." />
      </div>
    );
  }

  if (chatId) {
    return (
      <ErrorBoundary>
        <ChatArea onSend={handleSend} />

        {hasStarted && (
          <ChatInput
            mounted={false}
            input={input}
            setInput={setInput}
            onSend={() => {
              if (!input.trim() || isProcessing) return;
              handleSend(input);
              setInput("");
            }}
          />
        )}
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <EmptyState
        input={input}
        setInput={setInput}
        onSend={() => {
          if (!input.trim() || isProcessing) return;
          handleSend(input);
          setInput("");
        }}
      />
    </ErrorBoundary>
  );
}
