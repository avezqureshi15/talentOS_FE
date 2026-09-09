export type StatusToggleOption<T extends string> = {
  value: T;
  label: string;
  count?: number;
};

type StatusToggleBarProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: StatusToggleOption<T>[];
};

const StatusToggleBar = <T extends string>({ value, onChange, options }: StatusToggleBarProps<T>) => (
  <div className="filter-bar filter-bar-sections">
    <div className="filter-section filter-section-status">
      <div className="status-toggle-group">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`status-toggle-btn${value === opt.value ? " active" : ""}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
            {opt.count != null && <span className="status-toggle-count">{opt.count}</span>}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default StatusToggleBar;
