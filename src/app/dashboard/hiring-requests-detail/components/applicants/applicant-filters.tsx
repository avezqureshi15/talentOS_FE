import { useState, useEffect } from "react";
import Select from "@/components/ui/select/select";
import { SCORE_FILTERS, ROUND_VERDICT_FILTERS, REJECT_FILTER_OPTIONS, REJECT_FILTER_LABELS } from "./applicants.constants";
import type { ApplicantFiltersProps } from "./applicants.types";
import Chip from "@/components/ui/chip/chip";

const ApplicantFilters = ({ filter, onFilterChange, scoreFilter, onScoreFilterChange }: ApplicantFiltersProps) => {
  const [rejectSubFilter, setRejectSubFilter] = useState("all");

  useEffect(() => {
    if (filter !== "rejected") {
      setRejectSubFilter("all");
    }
  }, [filter]);

  const handleRejectChange = (value: string) => {
    setRejectSubFilter(value);
    onFilterChange("rejected");
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
          <Select
            options={REJECT_FILTER_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            value={filter !== "rejected" || rejectSubFilter === "all" ? "" : rejectSubFilter}
            onChange={(e) => handleRejectChange(e.target.value)}
            placeholder="Rejected"
            size="md"
            variant="ghost"
          />
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
        {filter === "rejected" && rejectSubFilter !== "all" && (
          <Chip variant="neutral" size="sm" onRemove={() => handleRejectChange("all")}>
            {REJECT_FILTER_LABELS[rejectSubFilter] ?? rejectSubFilter}
          </Chip>
        )}
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
