import { useState, useRef, useEffect } from "react";
import "./dropdown.css";
import type { DropdownProps } from "./dropdown.types";

const Dropdown = ({
  options,
  defaultValue,
  onChange,
}: DropdownProps) => {
  // justification: open state controls dropdown visibility
  const [open, setOpen] = useState(false);
  // justification: value tracks the currently selected option
  const [value, setValue] = useState(
    defaultValue || options[0]
  );

  const ref = useRef<HTMLDivElement>(null);

  // Explanation: closes the dropdown when a click occurs outside the component
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    setValue(val);
    setOpen(false);
    onChange?.(val);
  };

  return (
    <div className="dropdown" ref={ref}>
      <button
        className="dropdown-trigger"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="dropdown-value">{value}</span>
        <span className={`dropdown-icon ${open ? "open" : ""}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className="dropdown-menu">
          {options.map((opt) => (
            <div
              key={opt}
              className={`dropdown-item ${
                opt === value ? "active" : ""
              }`}
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;