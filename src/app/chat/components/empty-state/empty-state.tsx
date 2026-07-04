import React from "react";

import "./empty-state.css";
import type { EmptyStateProps } from "./empty-state.types";
import { CHAT_SUGGESTIONS, EMPTY_STATE } from "@/constants/constants";

const EmptyState: React.FC<EmptyStateProps> = ({ onSuggestionClick, showAurora }) => {
  return (
    <div className={`empty-state${showAurora ? " empty-state--aurora" : ""}`}>
      <div className="empty-state-aurora-bg" />
      <div className="empty-state-container">

        {/* Welcome chip */}
        <div className="empty-state-welcome-chip">
          <span className="empty-state-welcome-chip__sparkle">✦</span>
          Welcome to WebHyre AI
        </div>

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
