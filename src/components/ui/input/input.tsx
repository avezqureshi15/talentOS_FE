import React from "react";
import "./input.css";
import type { InputProps } from "./input.types";
import { UI_LABELS } from "@/constants/constants";

const Input: React.FC<InputProps> = ({ value, onChange, onKeyDown }) => {
  return (
    <input
      className="input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={UI_LABELS.ASK_ANYTHING}
    />
  );
};

export default Input;