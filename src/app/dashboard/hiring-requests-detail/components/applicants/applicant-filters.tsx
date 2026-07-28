import Select from "@/components/ui/select/select";
import { SCORE_FILTERS, ROUND_VERDICT_FILTERS } from "./applicants.constants";
import type { ApplicantFiltersProps } from "./applicants.types";
import Chip from "@/components/ui/chip/chip";

const REJECT_REASON_OPTIONS = [
  { value: "yoe", label: "YOE" },
  { value: "location", label: "Location" },
  { value: "budget", label: "Budget" },
  { value: "notice_period", label: "Notice Period" },
] as const;

const ApplicantFilters = ({ filter, onFilterChange, scoreFilter, onScoreFilterChange, rejectReason, onRejectReasonChange }: ApplicantFiltersProps) => {
  const activeReasons = rejectReason ? rejectReason.split(",").filter(Boolean) : [];

  const handleStatusFilterChange = (value: string) => {
    onFilterChange(value);
    if (value === "selected") {
      onRejectReasonChange("");
    }
  };

  const toggleReason = (value: string) => {
    const exists = activeReasons.includes(value);
    const next = exists
      ? activeReasons.filter((r) => r !== value)
      : [...activeReasons, value];
    onRejectReasonChange(next.join(","));
    if (next.length > 0 && filter !== "all") {
      onFilterChange("all");
    }
  };

  return (
    <>
      <div className="filter-bar filter-bar-sections">
        {/* Section 1: Status Tabs */}
        <div className="filter-section filter-section-status">
          <div className="status-toggle-group">
            {ROUND_VERDICT_FILTERS.map((opt) => (
              <button
                key={opt.value}
                className={`status-toggle-btn${filter === opt.value ? " active" : ""}`}
                onClick={() => handleStatusFilterChange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <span className="section-divider" />

        {/* Section 2: Score Filter */}
        <div className="filter-section filter-section-score">
          <span className="score-label">Score:</span>
          <Select
            options={SCORE_FILTERS.filter((o) => o.value !== "all").map((o) => ({ value: o.value, label: o.label }))}
            value={scoreFilter === "all" ? "" : scoreFilter}
            onChange={(e) => onScoreFilterChange?.(e.target.value || "all")}
            placeholder="All Scores"
            size="md"
            variant="ghost"
          />
        </div>

        <span className="section-divider" />

        {/* Section 3: Disqualified Criteria */}
        <div className="filter-section filter-section-disqualified">
          <span className="disqualified-label">Disqualified by:</span>
          <div className="disqualified-chips">
            {REJECT_REASON_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`disqualified-chip${activeReasons.includes(opt.value) ? " active" : ""}`}
                onClick={() => toggleReason(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="filter-chips">
        {activeReasons.map((reason) => (
          <Chip key={reason} variant="neutral" size="sm" onRemove={() => toggleReason(reason)}>
            {REJECT_REASON_OPTIONS.find((o) => o.value === reason)?.label ?? reason}
          </Chip>
        ))}
        {scoreFilter !== "all" && (
          <Chip variant="neutral" size="sm" onRemove={() => onScoreFilterChange?.("all")}>
            Score: {SCORE_FILTERS.find((o) => o.value === scoreFilter)?.label ?? scoreFilter}
          </Chip>
        )}
      </div>
    </>
  );
};

export default ApplicantFilters;
