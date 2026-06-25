import React from "react";
import "./send-button.css";
import type { SendButtonProps } from "./send-button.types";

const SendButton: React.FC<SendButtonProps> = ({ disabled, onClick }) => {
  return (
    <button className="send-btn" disabled={disabled} onClick={onClick}>
      <i className="bx bx-send-alt text-black" />
    </button>
  );
};

export default SendButton;