import FilterPopover from "@/components/ui/filter-popover/filter-popover";
import {
  UI_EVALUATION_DONE,
  UI_EVALUATION_PENDING,
  UI_EVALUATION_ROUND_ALL,
  UI_EVALUATED_AI,
  UI_EVALUATED_REGULAR,
} from "./detail.constants";
import type { EvaluationRoundFilter } from "./use-filtered-applicants";

export type EvaluationSubFilter = "evaluated" | "pending";

type Props = {
  value: EvaluationSubFilter;
  onChange: (v: EvaluationSubFilter) => void;
  counts: { evaluated: number; pending: number };
  roundFilter: EvaluationRoundFilter;
  onRoundFilterChange: (v: EvaluationRoundFilter) => void;
  roundCounts: Record<EvaluationRoundFilter, number>;
};

const ROUND_OPTIONS: { value: EvaluationRoundFilter; label: string }[] = [
  { value: "all", label: UI_EVALUATION_ROUND_ALL },
  { value: "ai", label: UI_EVALUATED_AI },
  { value: "regular", label: UI_EVALUATED_REGULAR },
];

const EvaluatedFilterBar = ({
  value,
  onChange,
  counts,
  roundFilter,
  onRoundFilterChange,
  roundCounts,
}: Props) => (
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

    <span className="section-divider" />

    <FilterPopover activeCount={roundFilter !== "all" ? 1 : 0}>
      <div className="filter-popover-group">
        <span className="filter-popover-label">Round type</span>
        <div className="filter-popover-options">
          {ROUND_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`filter-option${roundFilter === opt.value ? " active" : ""}`}
              onClick={() => onRoundFilterChange(opt.value)}
            >
              {opt.label}
              <span className="filter-option-count">{roundCounts[opt.value]}</span>
            </button>
          ))}
        </div>
      </div>

      {roundFilter !== "all" && (
        <button
          type="button"
          className="filter-popover-clear"
          onClick={() => onRoundFilterChange("all")}
        >
          Clear all
        </button>
      )}
    </FilterPopover>
  </div>
);

export default EvaluatedFilterBar;
