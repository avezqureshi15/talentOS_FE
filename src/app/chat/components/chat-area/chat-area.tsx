import React, { useEffect, useRef, useState } from "react";
import "./chat-area.css";

import UserMessage from "../../../../components/ui/user-message/user-message";
import SuggestionChips from "./block-renderer/blocks/suggestion-chips/suggestion-chips";

import { renderBlock } from "./block-renderer/block-factory";
import type { ContentBlock } from "./chart-area.type";
import type { Message, AIMessage, Suggestion } from "../../pages/chat.type";
import { useChatStore } from "../../../../store/chat.store";
import { Icon } from "../../../../components/ui/icons";
import TextArea from "./block-renderer/blocks/text-area/text-area";
type ChatAreaProps = {
  onSend: (text: string, depth: number) => Promise<void>;
};
const ChatArea: React.FC<ChatAreaProps> = (props:ChatAreaProps) => {
  const { messages, hasStarted } = useChatStore();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // -----------------------------
  // Scroll Handling
  // -----------------------------
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const threshold = 120;
    const isNearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold;

    setAutoScroll(isNearBottom);
  };

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
      style={{ flex: 1, overflowY: "auto", padding: "20px 0" }}
    >
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px" }}>
        {messages.length === 0 && (
          <div className="chat-watermark" aria-hidden="true">
            <div className="chat-watermark__brand">
              <div className="chat-watermark__logo">
                <Icon.Logo />
              </div>
              <h1 className="chat-watermark__wordmark">
                <span className="chat-watermark__talent">Talent</span>
                <span className="chat-watermark__os">OS</span>
              </h1>
            </div>
            <p className="chat-watermark__tagline">
              Intelligent hiring, powered by AI
            </p>
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
            <div key={msg.id}>
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
                    <div style={{ marginTop: 16 }}>
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
          );
        })}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatArea;