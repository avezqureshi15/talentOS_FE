import React, { useCallback, useEffect, useRef, useState } from "react";

import UserMessage from "@/components/ui/user-message/user-message";
import "./chat-area.css";
import SuggestionChips from "./block-renderer/blocks/suggestion-chips/suggestion-chips";

import { renderBlock } from "./block-renderer/block-factory";
import type { ContentBlock, Message, AIMessage, Suggestion } from "@/app/chat/pages/chat.types";
import { useChatStore } from "@/store/chat.store";
import TextArea from "./block-renderer/blocks/text-area/text-area";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import { useChatMessages } from "@/app/chat/hooks/use-chat-messages";

type ChatAreaProps = {
  onSend: (text: string) => void;
};
const ChatArea: React.FC<ChatAreaProps> = (props:ChatAreaProps) => {
  const { messages, hasStarted, isProcessing, error, hasMore } = useChatStore();
  const { loadMore, isLoadingMore } = useChatMessages();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const prevScrollHeightRef = useRef(0);

  // -----------------------------
  // Scroll Handling
  // -----------------------------
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    // Infinite scroll upward: detect scroll near top
    if (el.scrollTop < 100 && hasMore && !isLoadingMore) {
      prevScrollHeightRef.current = el.scrollHeight;
      loadMore();
    }

    const threshold = 120;
    const isNearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold;

    setAutoScroll(isNearBottom);
  }, [hasMore, loadMore, isLoadingMore]);

  // Preserve scroll position when older messages are prepended
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !prevScrollHeightRef.current) return;
    const newHeight = el.scrollHeight;
    const delta = newHeight - prevScrollHeightRef.current;
    if (delta > 0) {
      el.scrollTop += delta;
    }
    prevScrollHeightRef.current = 0;
  }, [messages]);

  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  // -----------------------------
  // Type Guards
  // -----------------------------
  const hasSuggestions = (
    msg: Message
  ): msg is AIMessage & { suggestions: Suggestion[] } => {
    return msg.role === "ai" && Array.isArray(msg.suggestions);
  };

  const hasUIAction = (
    msg: Message
  ): msg is AIMessage & {
    ui_action: {
      type: "SHOW_JOB_PANEL";
      payload: {
        jobId: string;
        role: string;
      };
    };
  } => {
    return msg.role === "ai" && msg.ui_action?.type === "SHOW_JOB_PANEL";
  };

  // -----------------------------
  // Content Helpers
  // -----------------------------
  const extractMarkdown = (msg: Message): string => {
    if (msg.role !== "ai") return "";
    const block = msg.content.find((b) => b.type === "markdown");
    return block?.content ?? "";
  };

  const extractText = (blocks: ContentBlock[]): string => {
    for (const b of blocks) {
      if (b.type === "text" || b.type === "thinking") {
        return b.text;
      }
    }
    return "";
  };

  if (!hasStarted) return null;

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="chat-area"
    >
      <div className="chat-area-container">
        {isLoadingMore && (
          <div className="chat-area__loading-more">
            <LoadingSpinner size="sm" label="Loading older messages..." />
          </div>
        )}

        {messages.map((msg) => {
          const isUI = hasUIAction(msg);

          // ✅ KEY FIX: filter markdown if UI action exists
          const visibleBlocks =
            msg.role === "ai" && isUI
              ? msg.content.filter((b) => b.type !== "markdown")
              : msg.content;

          return (
            <ErrorBoundary key={msg.id}>
            <div>
              {msg.role === "user" ? (
                <UserMessage text={extractText(msg.content)} />
              ) : (
                <div className="mb-10">
                  {/* -----------------------------
                      NORMAL CONTENT RENDER
                  ----------------------------- */}
                  {visibleBlocks.map((block, i) =>
                    renderBlock(block, i)
                  )}

                  {/* -----------------------------
                      UI ACTION (PURE SIDE EFFECT)
                  ----------------------------- */}
                  {isUI && (
                    <div className="chat-area__action">
                      <TextArea
                        subject={`Job Posting: ${msg.ui_action.payload.role}`}
                        name="HR System"
                        meta={msg.ui_action.payload.jobId}
                        content={extractMarkdown(msg)} // ONLY place markdown is used
                      />
                    </div>
                  )}

                  {/* -----------------------------
                      SUGGESTIONS
                  ----------------------------- */}
                  {hasSuggestions(msg) && (
                    <div className="chip-row">
                      <SuggestionChips
                        suggestions={msg.suggestions}
                        onSend={props.onSend}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            </ErrorBoundary>
          );
        })}

        {/* Error banner */}
        {error && (
          <div className="chat-area__error">
            <span>{error}</span>
          </div>
        )}

        {/* Typing indicator */}
        {isProcessing && (
          <div className="chat-area__typing">
            <LoadingSpinner size="sm" label="AI is thinking..." />
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatArea;