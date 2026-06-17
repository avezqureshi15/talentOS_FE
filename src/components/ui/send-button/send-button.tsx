import React from "react";
import "./send-button.css";
import type { SendButtonProps } from "./send-button.type";

const SendButton: React.FC<SendButtonProps> = ({
  children,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      className={`send-btn${disabled ? "" : " send-btn--active"}`}
      onClick={onClick}
      disabled={disabled}
      aria-label="Send message"
    >
      {children}
    </button>
  );
};

export default SendButton;
