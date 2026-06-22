import React from "react";
import "./select.css";
import type { SelectProps } from "./select.types";

const Select: React.FC<SelectProps> = ({ options, placeholder, className, ...nativeProps }) => {
  return (
    <span className="select-wrapper">
      <select className={`select ${className ?? ""}`} {...nativeProps}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </span>
  );
};

export default Select;
