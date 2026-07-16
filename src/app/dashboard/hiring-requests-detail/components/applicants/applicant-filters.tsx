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

  const toggleReason = (value: string) => {
    const exists = activeReasons.includes(value);
    let next: string[];
    if (exists) {
      next = activeReasons.filter((r) => r !== value);
    } else {
      next = [...activeReasons, value];
    }
    const nextStr = next.join(",");
    onRejectReasonChange(nextStr);
    if (next.length > 0) {
      onFilterChange("rejected");
    } else if (filter === "rejected") {
      onFilterChange("all");
    }
  };

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
          <span className="filter-separator-vertical" />
          {REJECT_REASON_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`round-verdict-chip${activeReasons.includes(opt.value) ? " active" : ""}`}
              onClick={() => toggleReason(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <span className="filter-separator" />
        <Select
          options={SCORE_FILTERS.filter((o) => o.value !== "all").map((o) => ({ value: o.value, label: o.label }))}
          value={scoreFilter === "all" ? "" : scoreFilter}
          onChange={(e) => onScoreFilterChange?.(e.target.value || "all")}
          placeholder="All Scores"
          size="md"
          variant="ghost"
        />
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