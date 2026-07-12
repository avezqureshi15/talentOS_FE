import { SCORE_FILTERS, ROUND_VERDICT_FILTERS } from "./applicants.constants";
import type { ApplicantFiltersProps } from "./applicants.types";

const ApplicantFilters = ({ filter, onFilterChange, scoreFilter, onScoreFilterChange }: ApplicantFiltersProps) => {
  return (
    <>
      <div className="filter-bar">
        <div className="round-verdict-chips">
          {ROUND_VERDICT_FILTERS.map((opt) => (
            <button
              key={opt.value}
              className={`round-verdict-chip${filter === opt.value ? " active" : ""}`}
              onClick={() => onFilterChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <span className="filter-separator" />
        <select
          className="score-filter-select"
          value={scoreFilter === "all" ? "" : scoreFilter}
          onChange={(e) => onScoreFilterChange?.(e.target.value || "all")}
        >
          <option value="">All Scores</option>
          {SCORE_FILTERS.filter((o) => o.value !== "all").map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div className="filter-chips">
        {scoreFilter !== "all" && (
          <span className="filter-chip">
            Score: {SCORE_FILTERS.find((o) => o.value === scoreFilter)?.label ?? scoreFilter}
            <i className="bx bx-x filter-chip-x" onClick={() => onScoreFilterChange?.("all")} />
          </span>
        )}
      </div>
    </>
  );
};

export default ApplicantFilters;
