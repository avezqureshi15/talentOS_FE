import React from "react";
import ChatInput from "@/components/ui/chat-input/chat-input";

import "./empty-state.css";
import type { EmptyStateProps } from "./empty-state.types";
import { CHAT_SUGGESTIONS, EMPTY_STATE } from "@/constants/constants";

const EmptyState: React.FC<EmptyStateProps> = ({
  input,
  setInput,
  onSend,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-container">

        {/* Greeting */}
        <div>
          <h1 className="empty-state-title">
            {EMPTY_STATE.GREETING}{" "}
            <span className="empty-state-wave">👋</span>
          </h1>
        </div>

        {/* Input */}
        <div className="w-full">
          <ChatInput
            mounted={false}
            input={input}
            setInput={setInput}
            onSend={onSend}
          />
        </div>

        {/* Suggestions */}
        <div className="empty-state-suggestions">
          {CHAT_SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => setInput(s)}
              className="empty-state-chip"
            >
              {s}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default EmptyState;