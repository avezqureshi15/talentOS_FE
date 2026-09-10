import { useRef, useCallback } from "react";
import "./select.css";
import type { SelectProps } from "./select.types";
import { SELECT_DEFAULT_SIZE, SELECT_DEFAULT_VARIANT } from "./select.constants";

const Select = ({
  options,
  placeholder,
  className = "",
  loading = false,
  error,
  size = SELECT_DEFAULT_SIZE,
  variant = SELECT_DEFAULT_VARIANT,
  clearable = false,
  searchable: _searchable,
  multiSelect: _multiSelect,
  value,
  onChange,
  disabled,
  ...nativeProps
}: SelectProps) => {
  const selectRef = useRef<HTMLSelectElement>(null);

  const wrapperClasses = [
    "select-wrapper",
    `select-wrapper--${variant}`,
    `select-wrapper--${size}`,
    loading && "select-wrapper--loading",
    error && "select-wrapper--error",
    (disabled || loading) && "select-wrapper--disabled",
    clearable && value && "select-wrapper--clearable",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleClear = useCallback(() => {
    if (!onChange) return;
    const nativeEvent = new Event("change", { bubbles: true });
    Object.defineProperty(nativeEvent, "target", {
      value: { value: "" },
      writable: false,
    });
    onChange(nativeEvent as unknown as React.ChangeEvent<HTMLSelectElement>);
  }, [onChange]);

  return (
    <div className={wrapperClasses}>
      <select
        ref={selectRef}
        className="select"
        value={value}
        onChange={onChange}
        disabled={disabled || loading}
        {...nativeProps}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      {loading && <i className="bx bx-loader-alt bx-spin select-indicator" />}
      {clearable && value && !loading && (
        <i className="bx bx-x select-clear" onClick={handleClear} />
      )}
      {error && <span className="select-error">{error}</span>}
    </div>
  );
};

export default Select;
