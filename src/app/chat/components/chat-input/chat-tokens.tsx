import React from "react";
import { TOKEN_ICONS } from "@/components/shared/mentions/constants";
import type { Token } from "@/components/shared/mentions/types";

type ChatTokensProps = {
  tokens: Token[];
  onReset: () => void;
};

const ChatTokens: React.FC<ChatTokensProps> = ({ tokens, onReset }) => {
  if (tokens.length === 0) return null;

  return (
    <div className="ci-token-row">
      {tokens.map((token, i) => (
        <span key={i} className="ci-token">
          <i className={`ci-token-icon ${TOKEN_ICONS[token.type] ?? "bx bx-help-circle"}`} />
          <span className="ci-token-label">{token.label}</span>
          {i === 0 && (
            <span
              className="ci-token-close"
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onReset();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  onReset();
                }
              }}
            >
              ✕
            </span>
          )}
        </span>
      ))}
    </div>
  );
};

export default ChatTokens;