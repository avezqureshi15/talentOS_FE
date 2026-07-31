import { useEffect, useMemo, useRef, useState } from "react";
import "./combobox.css";

export type ComboboxProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
};

export default function Combobox({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  error,
  className = "",
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, value]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    setHighlighted(-1);
  }, [value, open]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlighted((h) => (h + 1) % Math.max(filtered.length, 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlighted((h) => (h <= 0 ? Math.max(filtered.length - 1, 0) : h - 1));
        break;
      case "Enter":
        if (open && highlighted >= 0 && filtered[highlighted]) {
          e.preventDefault();
          onChange(filtered[highlighted]);
          setOpen(false);
        }
        break;
      case "Escape":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className={`combobox ${className}`.trim()}>
      <input
        className={`combobox-input${error ? " combobox-input--error" : ""}`}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={handleKeyDown}
      />
      <span className="combobox-caret">▾</span>
      {open && !disabled && (
        <ul className="combobox-panel">
          {filtered.length > 0 ? (
            filtered.map((opt, i) => (
              <li
                key={opt}
                className={`combobox-option${i === highlighted ? " combobox-option--highlighted" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(opt);
                  setOpen(false);
                }}
                onMouseEnter={() => setHighlighted(i)}
              >
                {opt}
              </li>
            ))
          ) : (
            <li className="combobox-empty">
              {value ? "Keep typing to add your own" : "No options"}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
