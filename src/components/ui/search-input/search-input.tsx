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
  onActivate?: () => void;
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
  onActivate,
  "aria-label": ariaLabel = "Search",
}: SearchInputProps) {
  const isTrigger = !!onActivate;

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
        readOnly={isTrigger}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onClick={isTrigger ? onActivate : undefined}
        onFocus={isTrigger ? onActivate : undefined}
      />
      {shortcut && <span className="search-input__shortcut">{shortcut}</span>}
    </div>
  );
}
