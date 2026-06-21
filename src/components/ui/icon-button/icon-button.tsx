import React from "react";
import "./icon-button.css";
import type { IconButtonProps } from "./icon-button.types";

const IconButton: React.FC<IconButtonProps> = ({
  children,
  onClick,
  className = "",
  size = "md",
}) => {
  return (
    <button
      onClick={onClick}
      className={`icon-btn icon-btn--${size} ${className}`}
    >
      {children}
    </button>
  );
};

export default IconButton;