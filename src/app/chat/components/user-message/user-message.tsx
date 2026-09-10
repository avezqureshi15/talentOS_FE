import { useState } from "react";
import "./user-message.css";
import type { UserMessageProps } from "./user-message.types";
import { USER_MESSAGE_LENGTH } from "./user-message.constants";

const UserMessage = ({ text }: UserMessageProps) => {
  // justification: tracks expand/collapse toggle for long user messages
  const [expanded, setExpanded] = useState(false);
  const needsTruncation = text.length > USER_MESSAGE_LENGTH;

  return (
    <div className="messageRow messageRowUser cui-fade-right">
      <div className="messageBubble messageUser">
        {needsTruncation && !expanded ? (
          <div className="truncated-wrap truncated-wrap--fade">{text}</div>
        ) : (
          text
        )}
        {needsTruncation && (
          <button className="show-more-btn" onClick={() => setExpanded((v) => !v)} type="button">
            {expanded ? <>Show less <i className="bx bx-chevron-up" /></> : <>Show more <i className="bx bx-chevron-down" /></>}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserMessage;
