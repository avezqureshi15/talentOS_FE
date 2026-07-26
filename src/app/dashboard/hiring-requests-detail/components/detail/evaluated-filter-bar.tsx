import { UI_EVALUATED_AI, UI_EVALUATED_REGULAR } from "./detail.constants";

type Props = {
  value: "ai" | "regular";
  onChange: (v: "ai" | "regular") => void;
};

const EvaluatedFilterBar = ({ value, onChange }: Props) => (
  <div className="filter-bar filter-bar-sections">
    <div className="filter-section filter-section-status">
      <div className="status-toggle-group">
        <button
          className={`status-toggle-btn${value === "ai" ? " active" : ""}`}
          onClick={() => onChange("ai")}
        >
          {UI_EVALUATED_AI}
        </button>
        <button
          className={`status-toggle-btn${value === "regular" ? " active" : ""}`}
          onClick={() => onChange("regular")}
        >
          {UI_EVALUATED_REGULAR}
        </button>
      </div>
    </div>
  </div>
);

export default EvaluatedFilterBar;
