import "./search-input.css";

export type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: "sm" | "md";
  variant?: "default" | "ghost";
  shortcut?: string;
  autoFocus?: boolean;
  className?: string;
  name?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  "aria-label"?: string;
};

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  size = "md",
  variant = "default",
  shortcut,
  autoFocus,
  className = "",
  name,
  onKeyDown,
  "aria-label": ariaLabel = "Search",
}: SearchInputProps) {
  return (
    <div className={`search-input search-input--${size} search-input--${variant} ${className}`.trim()}>
      <i className="bx bx-search search-input__icon" aria-hidden="true" />
      <input
        type="text"
        className="search-input__field"
        placeholder={placeholder}
        value={value}
        name={name}
        aria-label={ariaLabel}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      {shortcut && <span className="search-input__shortcut">{shortcut}</span>}
    </div>
  );
}
