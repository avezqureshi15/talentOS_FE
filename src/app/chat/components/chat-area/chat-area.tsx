import React, { useCallback, useEffect, useRef, useState } from "react";
import "./chat-area.css";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ChatBubble from "./chat-bubble";
import { useChatStore } from "@/store/chat.store";
import { useChatMessages } from "@/app/chat/hooks/use-chat-messages";
import { extractAllText } from "./chat-area.utils";
import { SCROLL_THRESHOLD, LOADING_MORE_LABEL, PROCESSING_LABEL } from "./chat-area.constants";
import type { ChatAreaProps } from "./chat-area.types";

const ChatArea: React.FC<ChatAreaProps> = (props: ChatAreaProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const prevScrollHeightRef = useRef(0);
  const [copiedMsgId, setCopiedMsgId] = useState<number | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const { messages, hasStarted, isProcessing, chatId, error } = useChatStore();

  const { hasMore, loadMore, isLoadingMore } = useChatMessages(chatId);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (el.scrollTop < 100 && hasMore && !isLoadingMore) {
      prevScrollHeightRef.current = el.scrollHeight;
      loadMore();
    }
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_THRESHOLD;
    setAutoScroll(isNearBottom);
  }, [hasMore, loadMore, isLoadingMore]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !prevScrollHeightRef.current) return;
    const delta = el.scrollHeight - prevScrollHeightRef.current;
    if (delta > 0) el.scrollTop += delta;
    prevScrollHeightRef.current = 0;
  }, [messages]);

  useEffect(() => {
    if (autoScroll) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, autoScroll]);

  const handleCopy = useCallback(async (id: number) => {
    const msg = messages.find((m) => m.id === id);
    if (!msg || msg.role !== "ai") return;
    const text = extractAllText(msg.content);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsgId(id);
      setTimeout(() => setCopiedMsgId(null), 1500);
    } catch { /* silently ignore clipboard errors */ }
  }, [messages]);

  if (!hasStarted) return null;

  return (
    <div ref={containerRef} onScroll={handleScroll} className="chat-area">
      <div className="chat-area-container">
        {isLoadingMore && (
          <div className="chat-area__loading-more">
            <LoadingSpinner size="sm" label={LOADING_MORE_LABEL} />
          </div>
        )}

        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            msg={msg}
            copiedMsgId={copiedMsgId}
            onCopy={handleCopy}
            onSend={props.onSend}
          />
        ))}

        {error && (
          <div className="chat-area__error">
            <span>{error}</span>
          </div>
        )}

        {isProcessing && (
          <div className="chat-area__typing">
            <LoadingSpinner size="sm" label={PROCESSING_LABEL} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatArea;
