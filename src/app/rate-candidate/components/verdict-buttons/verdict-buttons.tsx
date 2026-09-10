import type { VerdictButtonsProps, VerdictValue } from "./verdict-buttons.types";
import { VERDICT_OPTIONS, VERDICT_LABELS } from "./verdict-buttons.constants";
import "./verdict-buttons.css";

const VerdictButtons = ({ value, onChange }: VerdictButtonsProps) => {
  return (
    <div className="verdict">
      <h3 className="verdict-title">{VERDICT_LABELS.TITLE}</h3>
      <div className="verdict-options">
        {VERDICT_OPTIONS.map((opt) => {
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              className={`verdict-btn ${opt.cssClass}${isActive ? " verdict-btn--active" : ""}`}
              onClick={() => onChange(opt.value as VerdictValue)}
              type="button"
            >
              <i className={opt.icon} />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VerdictButtons;
