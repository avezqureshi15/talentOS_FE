import Select from "@/components/ui/select/select";
import Chip from "@/components/ui/chip/chip";
import { SCORE_FILTERS, ROUND_VERDICT_FILTERS, REJECT_REASON_OPTIONS } from "./applicants.constants";
import type { ApplicantFiltersProps } from "./applicants.types";

const ApplicantFilters = ({
  filter,
  onFilterChange,
  scoreFilter,
  onScoreFilterChange,
  rejectReason,
  onRejectReasonChange,
}: ApplicantFiltersProps) => {
  const activeReasons = rejectReason ? rejectReason.split(",").filter(Boolean) : [];
  const isRejected = filter === "rejected";

  const toggleReason = (value: string) => {
    const exists = activeReasons.includes(value);
    const next = exists
      ? activeReasons.filter((r) => r !== value)
      : [...activeReasons, value];
    onRejectReasonChange(next.join(","));
    if (next.length > 0 && !isRejected) {
      onFilterChange("rejected");
    }
  };

  return (
    <>
      <div className="filter-bar">
        <div className="round-verdict-chips">
          {ROUND_VERDICT_FILTERS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`round-verdict-chip${filter === opt.value ? " active" : ""}`}
              onClick={() => onFilterChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <span className="filter-separator" />
        <Select
          options={SCORE_FILTERS.filter((o) => o.value !== "all").map((o) => ({
            value: o.value,
            label: o.label,
          }))}
          value={scoreFilter === "all" ? "" : scoreFilter}
          onChange={(e) => onScoreFilterChange?.(e.target.value || "all")}
          placeholder="All Scores"
          size="md"
          variant="ghost"
        />
      </div>

      {isRejected && (
        <div className="reject-reason-chips" role="group" aria-label="Reject reasons">
          {REJECT_REASON_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`round-verdict-chip${activeReasons.includes(opt.value) ? " active" : ""}`}
              onClick={() => toggleReason(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {scoreFilter !== "all" && (
        <div className="filter-chips">
          <Chip variant="neutral" size="sm" onRemove={() => onScoreFilterChange?.("all")}>
            Score: {SCORE_FILTERS.find((o) => o.value === scoreFilter)?.label ?? scoreFilter}
          </Chip>
        </div>
      )}
    </>
  );
};

export default ApplicantFilters;
