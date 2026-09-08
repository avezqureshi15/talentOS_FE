import { UI_EVALUATION_DONE, UI_EVALUATION_PENDING } from "./detail.constants";

export type EvaluationSubFilter = "evaluated" | "pending";

type Props = {
  value: EvaluationSubFilter;
  onChange: (v: EvaluationSubFilter) => void;
  counts: { evaluated: number; pending: number };
};

const EvaluatedFilterBar = ({ value, onChange, counts }: Props) => (
  <div className="filter-bar filter-bar-sections">
    <div className="filter-section filter-section-status">
      <div className="status-toggle-group">
        <button
          className={`status-toggle-btn${value === "evaluated" ? " active" : ""}`}
          onClick={() => onChange("evaluated")}
        >
          {UI_EVALUATION_DONE} <span className="status-toggle-count">{counts.evaluated}</span>
        </button>
        <button
          className={`status-toggle-btn${value === "pending" ? " active" : ""}`}
          onClick={() => onChange("pending")}
        >
          {UI_EVALUATION_PENDING} <span className="status-toggle-count">{counts.pending}</span>
        </button>
      </div>
    </div>
  </div>
);

export default EvaluatedFilterBar;
