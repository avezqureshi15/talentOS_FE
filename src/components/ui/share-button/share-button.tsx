import React from "react";
import "./share-button.css";
import type { ShareButtonProps } from "./share-button.types";

const ShareButton: React.FC<ShareButtonProps> = ({ icon, onClick }) => {
  return (
    <button className="share-btn" onClick={onClick}>
      {icon} Share
    </button>
  );
};

export default ShareButton;