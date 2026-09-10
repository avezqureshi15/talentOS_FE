import { SCORE_FILTERS, ROUND_VERDICT_FILTERS } from "./applicants.constants";
import type { ApplicantFiltersProps } from "./applicants.types";
import Chip from "@/components/ui/chip/chip";
import FilterPopover from "@/components/ui/filter-popover/filter-popover";

const REJECT_REASON_OPTIONS = [
  { value: "yoe", label: "YOE" },
  { value: "location", label: "Location" },
  { value: "budget", label: "Budget" },
  { value: "notice_period", label: "Notice Period" },
] as const;

const ApplicantFilters = ({ filter, onFilterChange, scoreFilter, onScoreFilterChange, rejectReason, onRejectReasonChange }: ApplicantFiltersProps) => {
  const activeReasons = rejectReason ? rejectReason.split(",").filter(Boolean) : [];
  const activeCount =
    activeReasons.length +
    (scoreFilter !== "all" ? 1 : 0) +
    (filter === "referral" ? 1 : 0);

  const statusTabs = ROUND_VERDICT_FILTERS.filter((o) => o.value !== "referral");

  const handleStatusFilterChange = (value: string) => {
    onFilterChange(value);
    if (value === "selected" || value === "referral") {
      onRejectReasonChange("");
    }
  };

  const toggleReferral = () => {
    handleStatusFilterChange(filter === "referral" ? "all" : "referral");
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

  const clearAll = () => {
    onScoreFilterChange?.("all");
    onRejectReasonChange("");
    onFilterChange("all");
  };

  return (
    <>
      <div className="filter-bar filter-bar-sections">
        {/* Section 1: Status Tabs */}
        <div className="filter-section filter-section-status">
          <div className="status-toggle-group">
            {statusTabs.map((opt) => (
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

        {/* Section 2: Filters popover (Candidate type + Score + Disqualified) */}
        <FilterPopover activeCount={activeCount}>
          <div className="filter-popover-group">
            <span className="filter-popover-label">Candidate type</span>
            <div className="filter-popover-options">
              <button
                type="button"
                className={`filter-option${filter === "referral" ? " active" : ""}`}
                onClick={toggleReferral}
              >
                Referral
              </button>
            </div>
          </div>

          <div className="filter-popover-divider" />

          <div className="filter-popover-group">
            <span className="filter-popover-label">Score</span>
            <div className="filter-popover-options">
              {SCORE_FILTERS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`filter-option${scoreFilter === opt.value ? " active" : ""}`}
                  onClick={() => onScoreFilterChange?.(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-popover-divider" />

          <div className="filter-popover-group">
            <span className="filter-popover-label">Disqualified by</span>
            <div className="filter-popover-chips">
              {REJECT_REASON_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`disqualified-chip${activeReasons.includes(opt.value) ? " active" : ""}`}
                  onClick={() => toggleReason(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {activeCount > 0 && (
            <button type="button" className="filter-popover-clear" onClick={clearAll}>
              Clear all
            </button>
          )}
        </FilterPopover>
      </div>

      <div className="filter-chips">
        {filter === "referral" && (
          <Chip variant="neutral" size="sm" onRemove={() => onFilterChange("all")}>
            Referral
          </Chip>
        )}
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
