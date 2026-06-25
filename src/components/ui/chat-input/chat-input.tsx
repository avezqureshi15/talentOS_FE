import React from "react";
import SendButton from "@/components/ui/send-button/send-button";

import "./chat-input.css";
import type { ChatInputProps } from "./chat-input.types";
import { useMentionEngine } from "@/components/shared/mentions/use-mention-engine";
import MentionPopup from "@/components/shared/mentions/mentions";
import { useAutoResize } from "./hooks/useAutoResize";
import { CHAT_INPUT_LABELS } from "./chat-input.constants";

const ChatInput: React.FC<ChatInputProps> = ({
  mounted = true,
  input,
  setInput,
  onSend,
}) => {
  const { textareaRef } = useAutoResize(input);

  const {
    show,
    data,
    activeTrigger,
    handleChange,
    handleSelect,
  } = useMentionEngine();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) onSend();
    }
    handleChange(input, input.length);
  };

  return (
    <div className={`cui-fade-up cui-d3${mounted ? "" : " opacity-0"}`}>
      <div className="chat-input-root">
        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <textarea
              ref={textareaRef}
              className="chat-input-textarea"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                handleChange(e.target.value, e.target.value.length);
              }}
              onKeyDown={handleKeyDown}
              placeholder={CHAT_INPUT_LABELS.PLACEHOLDER}
              rows={1}
            />

            <SendButton
              disabled={!input.trim()}
              onClick={() => {
                if (input.trim()) onSend();
              }}
            />
          </div>

          <MentionPopup
            show={show}
            data={data}
            activeTrigger={activeTrigger}
            onSelect={(item) =>
              handleSelect(item, input, setInput)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInput;