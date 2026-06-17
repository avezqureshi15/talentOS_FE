import React from "react";
import Input from "../input/input";
import SendButton from "../send-button/send-button";

import "./chat-input.css";
import type { ChatInputProps } from "./chat-input.type";
import { useMentionEngine } from "../../shared/mentions/use-mention-engine";
import MentionPopup from "../../shared/mentions";

/* ───────────────── TYPES ───────────────── */


/* ───────────────── MAIN ───────────────── */

const ChatInput: React.FC<ChatInputProps> = ({
  mounted = true,
  input,
  setInput,
  Icon,
  onSend,
}) => {
  const {
    show,
    data,
    activeTrigger,
    handleChange,
    handleSelect,
  } = useMentionEngine();
  return (
    <div className={`cui-fade-up cui-d3${mounted ? "" : " opacity-0"}`}>
      <div className="chat-input-root">
        <div className="chat-input-container">

          <div className="chat-input-wrapper">
            {/* Input */}
            <Input
              value={input}
              onChange={(val: string) => {
                setInput(val);
                handleChange(val, val.length); // 👈 inject here
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") onSend();
              }}
            />

            <MentionPopup
              show={show}
              data={data}
              activeTrigger={activeTrigger}
              onSelect={(item) =>
                handleSelect(item, input, setInput)
              }
            />

            {/* Right actions */}
            <div className="chat-input-actions">
              <SendButton onClick={onSend} disabled={!input.trim()}>
                {Icon?.ArrowUp ? <Icon.ArrowUp /> : "↑"}
              </SendButton>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChatInput;