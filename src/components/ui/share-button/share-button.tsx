import React from "react";
import "./share-button.css";
import type { ShareButtonProps } from "./share-button.types";
import { SHARE_BUTTON_LABELS } from "./share-button.constants";

const ShareButton: React.FC<ShareButtonProps> = ({ icon, onClick, label }) => {
  return (
    <button className="share-btn" onClick={onClick}>
      {icon} {label ?? SHARE_BUTTON_LABELS.FALLBACK}
    </button>
  );
};

export default ShareButton;