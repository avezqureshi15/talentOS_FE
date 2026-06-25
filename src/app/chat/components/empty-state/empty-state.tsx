import React from "react";

import "./empty-state.css";
import type { EmptyStateProps } from "./empty-state.types";
import { CHAT_SUGGESTIONS, EMPTY_STATE } from "@/constants/constants";

const EmptyState: React.FC<EmptyStateProps> = ({ onSuggestionClick }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-container">

        {/* Greeting */}
        <div>
          <h1 className="empty-state-title !mb-3">
            {EMPTY_STATE.GREETING}{" "}
            <span className="empty-state-wave">👋</span>
          </h1>
        </div>

        {/* Suggestions */}
        <div className="empty-state-suggestions">
          {CHAT_SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => onSuggestionClick(s)}
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
