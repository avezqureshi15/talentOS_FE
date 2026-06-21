import React from "react";
import "./send-button.css";
import type { SendButtonProps } from "./send-button.types";



const SendButton: React.FC<SendButtonProps> = ({ children, onClick }) => {
  return (
    <button className="send-btn" onClick={onClick}>
      {children}
    </button>
  );
};

export default SendButton;