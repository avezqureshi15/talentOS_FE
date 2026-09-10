import { UI_SCREENING_PENDING, UI_SCREENING_COMPLETED, UI_SCREENING_FLAGGED } from "./detail.constants";

type ScreeningSubFilter = "pending" | "completed" | "flagged";

type Props = {
  value: ScreeningSubFilter;
  onChange: (v: ScreeningSubFilter) => void;
  counts: Record<ScreeningSubFilter, number>;
};

const ScreeningFilterBar = ({ value, onChange, counts }: Props) => (
  <div className="filter-bar filter-bar-sections">
    <div className="filter-section filter-section-status">
      <div className="status-toggle-group">
        <button
          className={`status-toggle-btn${value === "pending" ? " active" : ""}`}
          onClick={() => onChange("pending")}
        >
          {UI_SCREENING_PENDING} <span className="status-toggle-count">{counts["pending"]}</span>
        </button>
        <button
          className={`status-toggle-btn${value === "completed" ? " active" : ""}`}
          onClick={() => onChange("completed")}
        >
          {UI_SCREENING_COMPLETED} <span className="status-toggle-count">{counts["completed"]}</span>
        </button>
        <button
          className={`status-toggle-btn${value === "flagged" ? " active" : ""}`}
          onClick={() => onChange("flagged")}
        >
          {UI_SCREENING_FLAGGED} <span className="status-toggle-count">{counts["flagged"]}</span>
        </button>
      </div>
    </div>
  </div>
);

export default ScreeningFilterBar;
