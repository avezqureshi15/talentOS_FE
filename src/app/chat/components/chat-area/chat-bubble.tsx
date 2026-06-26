import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import UserMessage from "@/components/ui/user-message/user-message";
import SuggestionChips from "./block-renderer/blocks/suggestion-chips/suggestion-chips";
import TextArea from "./block-renderer/blocks/text-area/text-area";
import { renderBlock } from "./block-renderer/block-factory";
import { hasSuggestions, hasUIAction, extractFirstText, extractMarkdown } from "./chat-area.utils";
import { COPY_LABEL } from "./chat-area.constants";
import type { Message, ContentBlock } from "@/app/chat/pages/chat.types";

type ChatBubbleProps = {
  msg: Message;
  copiedMsgId: string | null;
  onCopy: (id: string, blocks: ContentBlock[]) => void;
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

const ChatBubble = ({ msg, copiedMsgId, onCopy, onSend }: ChatBubbleProps) => {
  const isUI = hasUIAction(msg);

  const visibleBlocks = msg.role === "ai" && isUI
    ? msg.content.filter((b) => b.type !== "markdown")
    : msg.content;

  return (
    <ErrorBoundary>
      <div>
        {msg.role === "user" ? (
          <UserMessage text={extractFirstText(msg.content)} />
        ) : (
          <div className="mb-10">
            {visibleBlocks.map((block, i) => renderBlock(block, i))}

            <button
              className={`chat-copy-btn${copiedMsgId === msg.id ? " chat-copy-btn--copied" : ""}`}
              onClick={() => onCopy(msg.id, visibleBlocks)}
              title={COPY_LABEL}
              type="button"
            >
              {copiedMsgId === msg.id ? <CheckIcon /> : <CopyIcon />}
            </button>

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
