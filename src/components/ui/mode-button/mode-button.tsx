import React from "react";
import "./mode-button.css";
import { UI_LABELS } from "@/constants/constants";

const ModeButton = ({ icon }: { icon: React.ReactNode }) => {
  return (
    <button className="mode-btn">
      {UI_LABELS.FAST_MODE} {icon}
    </button>
  );
};

export default ModeButton;