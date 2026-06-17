import React from "react";
import ChatInput from "../../../../components/ui/chat-input/chat-input";
import { Icon } from "../../../../components/ui/icons";

import "./empty-state.css";
import type { EmptyStateProps } from "./empty-state.type";

const SUGGESTIONS = [
  "Explain React hooks simply",
  "Give me LeetCode plan",
  "Optimize my resume",
];

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
            Good to see you, Avez{" "}
            <span style={{ animation: "pulse 1.5s infinite" }}>👋</span>
          </h1>
        </div>

        {/* Input */}
        <div className="w-full">
          <ChatInput
            mounted={false}
            input={input}
            setInput={setInput}
            onSend={onSend}
            Icon={Icon}
          />
        </div>

        {/* Suggestions */}
        <div className="empty-state-suggestions">
          {SUGGESTIONS.map((s, i) => (
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