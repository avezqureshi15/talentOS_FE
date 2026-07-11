import { useState } from "react";
import Select from "@/components/ui/select/select";
import { SCORE_FILTERS, STATUS_FILTER_OPTIONS, STATUS_FILTER_LABELS, REJECT_FILTER_OPTIONS, REJECT_FILTER_LABELS } from "./applicants.constants";
import type { ApplicantFiltersProps } from "./applicants.types";

const ApplicantFilters = ({ filter, onFilterChange, scoreFilter, onScoreFilterChange }: ApplicantFiltersProps) => {
  // justification: local UI state for rejected-by filter dropdown
  const [rejectFilter, setRejectFilter] = useState("all");

  return (
    <>
      <div className="filter-bar">
        <Select
          placeholder="Filter"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          options={STATUS_FILTER_OPTIONS}
        />
        <span className="filter-separator" />
        <Select
          placeholder="All Scores"
          value={scoreFilter === "all" ? "" : scoreFilter}
          onChange={(e) => onScoreFilterChange?.(e.target.value || "all")}
          options={SCORE_FILTERS.filter((o) => o.value !== "all").map((o) => ({ value: o.value, label: o.label }))}
        />
        <span className="filter-separator" />
        <Select
          placeholder="Rejected"
          value={rejectFilter === "all" ? "" : rejectFilter}
          onChange={(e) => setRejectFilter(e.target.value || "all")}
          options={REJECT_FILTER_OPTIONS}
        />
      </div>
      <div className="filter-chips">
        {filter !== "all" && (
          <span className="filter-chip">
            {STATUS_FILTER_LABELS[filter]}
            <i className="bx bx-x filter-chip-x" onClick={() => onFilterChange("all")} />
          </span>
        )}
        {scoreFilter !== "all" && (
          <span className="filter-chip">
            Score: {SCORE_FILTERS.find((o) => o.value === scoreFilter)?.label ?? scoreFilter}
            <i className="bx bx-x filter-chip-x" onClick={() => onScoreFilterChange?.("all")} />
          </span>
        )}
        {rejectFilter !== "all" && (
          <span className="filter-chip">
            Rejected: {REJECT_FILTER_LABELS[rejectFilter]}
            <i className="bx bx-x filter-chip-x" onClick={() => setRejectFilter("all")} />
          </span>
        )}
      </div>
    </>
  );
};

export default ApplicantFilters;
