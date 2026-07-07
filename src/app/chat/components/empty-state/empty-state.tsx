import React from "react";

import "./empty-state.css";
import type { EmptyStateProps } from "./empty-state.types";
import { CHAT_SUGGESTIONS, EMPTY_STATE } from "@/constants/constants";
import { useAuth } from "@/app/auth/hooks/use-auth";

const MAX_SECOND_WORD_LENGTH = 8;

function getFirstName(fullName: string): string {
  const name = fullName.split(" | ")[0].trim();
  const parts = name.split(/\s+/);
  if (parts.length >= 2) {
    return parts[1].length > MAX_SECOND_WORD_LENGTH ? parts[0] : parts.slice(0, 2).join(" ");
  }
  return parts[0] || name;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onSuggestionClick, showAurora }) => {
  const { user } = useAuth();
  const name = user?.name ? getFirstName(user.name) : "";

  return (
    <div className={`empty-state${showAurora ? " empty-state--aurora" : ""}`}>
      <div className="empty-state-aurora-bg" />
      <div className="empty-state-container">

        {/* Welcome chip */}
        <div className="empty-state-welcome-chip">
          <span className="empty-state-welcome-chip__sparkle">✦</span>
          Welcome to webHyre AI
        </div>

        {/* Greeting */}
        <div>
          <h1 className="empty-state-title !mb-3">
            {EMPTY_STATE.GREETING} {name}{" "}
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
