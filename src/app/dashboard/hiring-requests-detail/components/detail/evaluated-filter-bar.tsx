import { UI_EVALUATED_AI, UI_EVALUATED_REGULAR } from "./detail.constants";

type Props = {
  value: "ai" | "regular";
  onChange: (v: "ai" | "regular") => void;
  counts: { ai: number; regular: number };
};

const EvaluatedFilterBar = ({ value, onChange, counts }: Props) => (
  <div className="filter-bar filter-bar-sections">
    <div className="filter-section filter-section-status">
      <div className="status-toggle-group">
        <button
          className={`status-toggle-btn${value === "ai" ? " active" : ""}`}
          onClick={() => onChange("ai")}
        >
          {UI_EVALUATED_AI} <span className="status-toggle-count">{counts.ai}</span>
        </button>
        <button
          className={`status-toggle-btn${value === "regular" ? " active" : ""}`}
          onClick={() => onChange("regular")}
        >
          {UI_EVALUATED_REGULAR} <span className="status-toggle-count">{counts.regular}</span>
        </button>
      </div>
    </div>
  </div>
);

export default EvaluatedFilterBar;
