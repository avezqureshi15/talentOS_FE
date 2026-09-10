import { useEffect, useMemo, useRef, useState } from "react";
import Chip from "@/components/ui/chip/chip";
import type { MultiComboboxProps } from "./multi-combobox.types";
import "./multi-combobox.css";

const normalize = (value: string) => value.trim();

const isDuplicate = (items: string[], candidate: string) =>
  items.some((item) => item.toLowerCase() === candidate.toLowerCase());

export default function MultiCombobox({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  error,
  className = "",
  maxItemLength = 255,
}: MultiComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const availableOptions = useMemo(
    () => options.filter((opt) => !isDuplicate(value, opt)),
    [options, value],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return availableOptions;
    return availableOptions.filter((opt) => opt.toLowerCase().includes(q));
  }, [availableOptions, query]);

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
  }, [query, open]);

  const addItem = (raw: string) => {
    const next = normalize(raw);
    if (!next || next.length > maxItemLength) return;
    if (isDuplicate(value, next)) {
      setQuery("");
      setOpen(false);
      return;
    }
    onChange([...value, next]);
    setQuery("");
    setOpen(false);
  };

  const removeItem = (item: string) => {
    onChange(value.filter((v) => v !== item));
  };

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
        e.preventDefault();
        if (open && highlighted >= 0 && filtered[highlighted]) {
          addItem(filtered[highlighted]);
        } else if (query.trim()) {
          addItem(query);
        }
        break;
      case "Backspace":
        if (!query && value.length > 0) {
          removeItem(value[value.length - 1]);
        }
        break;
      case "Escape":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className={`multi-combobox ${className}`.trim()}>
      {value.length > 0 && (
        <div className="multi-combobox-chips">
          {value.map((item) => (
            <Chip
              key={item}
              size="sm"
              onRemove={disabled ? undefined : () => removeItem(item)}
            >
              {item}
            </Chip>
          ))}
        </div>
      )}
      <div className="multi-combobox-input-wrap">
        <input
          className={`multi-combobox-input${error ? " multi-combobox-input--error" : ""}`}
          value={query}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <span className="multi-combobox-caret">▾</span>
        {open && !disabled && (
          <ul className="multi-combobox-panel">
            {filtered.length > 0 ? (
              filtered.map((opt, i) => (
                <li
                  key={opt}
                  className={`multi-combobox-option${i === highlighted ? " multi-combobox-option--highlighted" : ""}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addItem(opt);
                  }}
                  onMouseEnter={() => setHighlighted(i)}
                >
                  {opt}
                </li>
              ))
            ) : (
              <li className="multi-combobox-empty">
                {query.trim() ? "Press Enter to add" : "No options"}
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
