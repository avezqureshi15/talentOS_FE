import { useState, useCallback } from "react";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import UserMessage from "@/app/chat/components/user-message/user-message";
import CommandCard from "@/app/chat/components/command-card/command-card";
import SuggestionChips from "./block-renderer/blocks/suggestion-chips/suggestion-chips";
import TextArea from "./block-renderer/blocks/text-area/text-area";
import { renderBlock } from "./block-renderer/block-factory";
import { useChatStore } from "@/store/chat.store";
import { hasSuggestions, hasUIAction, extractFirstText, extractMarkdown, isCommandExecution, parseCommandExecution, isHybridQuestion, parseHybridQuestion } from "./chat-area.utils";
import { COPY_LABEL } from "./chat-area.constants";
import type { Message, ContentBlock, AIMessage } from "@/app/chat/pages/chat.types";
import type { BlockExtraProps } from "./block-renderer/block-renderer.types";

type ChatBubbleProps = {
  msg: Message;
  copiedMsgId: number | null;
  onCopy: (id: number, blocks: ContentBlock[]) => void;
  onSend: (text: string) => void;
};

const CopyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const PencilIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const ChatBubble = ({ msg, copiedMsgId, onCopy, onSend }: ChatBubbleProps) => {
  const [editingMsgId, setEditingMsgId] = useState<number | null>(null);
  const updateMessage = useChatStore((s) => s.updateMessage);

  const isUI = hasUIAction(msg);
  const isEditing = editingMsgId === msg.id;

  const visibleBlocks = msg.role === "ai" && isUI
    ? msg.content.filter((b) => b.type !== "markdown")
    : msg.content;

  const handleEditRequest = useCallback(() => {
    setEditingMsgId(msg.id);
  }, [msg.id]);

  const handleSave = useCallback(
    (content: string) => {
      updateMessage(msg.id, (m: Message) => {
        const aiMsg = m as AIMessage;
        return {
          ...aiMsg,
          content: aiMsg.content.map((b) =>
            b.type === "markdown" && b.ui === "EDITABLE"
              ? { ...b, content }
              : b
          ),
        };
      });
      setEditingMsgId(null);
    },
    [msg.id, updateMessage]
  );

  const blockExtra: BlockExtraProps | undefined = msg.role === "ai"
    ? {
        isEditing,
        onSave: handleSave,
        onEditRequest: handleEditRequest,
      }
    : undefined;

  return (
    <ErrorBoundary>
      <div>
        {msg.role === "user" ? (
          (() => {
            const text = extractFirstText(msg.content);
            const cmdData = isCommandExecution(text) ? parseCommandExecution(text) : null;
            const hybridData = !cmdData && isHybridQuestion(text) ? parseHybridQuestion(text) : null;
            return cmdData ? <CommandCard data={cmdData} /> : hybridData ? <CommandCard hybrid={hybridData} /> : <UserMessage text={text} />;
          })()
        ) : (
          <div className="mb-10">
            {visibleBlocks.map((block, i) => renderBlock(block, i, blockExtra))}

            <div className="chat-msg-toolbar">
              <button
                className={`chat-toolbar-btn${copiedMsgId === msg.id ? " chat-toolbar-btn--active" : ""}`}
                onClick={() => onCopy(msg.id, visibleBlocks)}
                title={COPY_LABEL}
                type="button"
              >
                {copiedMsgId === msg.id ? <CheckIcon /> : <CopyIcon />}
              </button>

              {msg.role === "ai" && msg.content.some((b) => b.type === "markdown" && b.ui === "EDITABLE") && (
                <button
                  className={`chat-toolbar-btn${isEditing ? " chat-toolbar-btn--active" : ""}`}
                  onClick={isEditing ? undefined : handleEditRequest}
                  title="Edit"
                  type="button"
                >
                  <PencilIcon />
                </button>
              )}
            </div>

            {isUI && (
              <div className="chat-area__action">
                <TextArea
                  subject={`Job Posting: ${msg.ui_action.payload.role}`}
                  name="HR System"
                  meta={msg.ui_action.payload.jobId}
                  content={extractMarkdown(msg)}
                />
              </div>
            )}

            {hasSuggestions(msg) && (
              <div className="chip-row">
                <SuggestionChips suggestions={msg.suggestions} onSend={onSend} />
              </div>
            )}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ChatBubble;