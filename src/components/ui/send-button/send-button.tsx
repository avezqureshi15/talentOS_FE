import React from "react";
import "./send-button.css";
import type { SendButtonProps } from "./send-button.types";

const SendButton: React.FC<SendButtonProps> = ({ disabled, onClick, animate }) => {
  return (
    <button className={`send-btn${animate ? " send-btn--animate" : ""}`} disabled={disabled} onClick={onClick}>
      <i className="bx bx-send-alt text-black" />
    </button>
  );
};

export default SendButton;