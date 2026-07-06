import { useState, useEffect, useRef, useCallback } from "react";
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
import { useAurora } from "@/hooks/use-aurora";
import { CHAT_BASE_PATH } from "./chat.constants";
import { STORAGE_KEYS, TWENTY_FOUR_HOURS } from "@/constants/constants";
import { hasUxElapsed, patchUx } from "@/utils/storage";
import type { WizardExecutionPayload, HybridQuestionPayload } from "@/components/shared/mentions/types";

export default function Chat() {
  const [input, setInput] = useState("");
  const { chatId: paramsChatId } = useParams();
  const { show: showAurora, dismiss: dismissAurora } = useAurora();
  const interactedRef = useRef(false);
  const [emptyLeaving, setEmptyLeaving] = useState(false);

  const handleInteraction = useCallback(() => {
    if (!interactedRef.current) {
      interactedRef.current = true;
      dismissAurora();
    }
  }, [dismissAurora]);

  useEffect(() => {
    if (input && !interactedRef.current) {
      handleInteraction();
    }
  }, [input, handleInteraction]);

  useEffect(() => {
    if (emptyLeaving) {
      const timer = setTimeout(() => setEmptyLeaving(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [emptyLeaving]);

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
    handleInteraction();
    if (!chatId) {
      const newId = crypto.randomUUID();
      setChatId(newId);
      if (hasUxElapsed(STORAGE_KEYS.UX, "ft", TWENTY_FOUR_HOURS)) {
        patchUx(STORAGE_KEYS.UX, { ft: Date.now() });
        setEmptyLeaving(true);
      }
      window.history.replaceState(null, "", `${CHAT_BASE_PATH}${newId}`);
      chatStream.mutate({ text, chatId: newId });
    } else {
      chatStream.mutate({ text });
    }
  };

  const handleWizardComplete = (payload: WizardExecutionPayload | HybridQuestionPayload) => {
    handleInteraction();
    handleSend(JSON.stringify(payload));
  };

  const showLoading = chatId && !emptyLeaving && isLoading && messages.length === 0;

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
          <div className={`empty-state-fade${emptyLeaving ? " empty-state-fade--leave" : ""}`}>
            <EmptyState onSuggestionClick={(text) => { handleInteraction(); setInput(text); }} showAurora={showAurora} />
          </div>
        )}

        {chatId && emptyLeaving && (
          <div className="empty-state-fade empty-state-fade--overlay empty-state-fade--leave">
            <EmptyState onSuggestionClick={(text) => { handleInteraction(); setInput(text); }} showAurora={false} />
          </div>
        )}

        {(hasStarted || !chatId || emptyLeaving) && (
          <ChatInput
            mounted={false}
            input={input}
            setInput={setInput}
            onSend={() => {
              if (!input.trim() || isProcessing) return;
              handleInteraction();
              handleSend(input);
              setInput("");
            }}
            onWizardComplete={handleWizardComplete}
            showAurora={showAurora}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
