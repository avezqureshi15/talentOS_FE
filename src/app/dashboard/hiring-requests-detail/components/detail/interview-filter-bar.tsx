import FilterPopover from "@/components/ui/filter-popover/filter-popover";
import {
  UI_INTERVIEW_TAB_INCOMING,
  UI_INTERVIEW_TAB_NO_SHOW,
  UI_INTERVIEW_TYPE_ALL,
  UI_INTERVIEW_TYPE_AI,
  UI_INTERVIEW_TYPE_REGULAR,
  UI_INTERVIEW_SCHEDULED,
  UI_INTERVIEW_ONGOING,
} from "./detail.constants";
import type { InterviewTab, InterviewType } from "./use-filtered-applicants";

export type InterviewScheduleFilter = "scheduled" | "ongoing" | null;

type Props = {
  tab: InterviewTab;
  onTabChange: (v: InterviewTab) => void;
  counts: { incoming: number; "no-show": number };
  type: InterviewType;
  onTypeChange: (v: InterviewType) => void;
  typeCounts: { all: number; ai: number; regular: number };
  scheduleFilter: InterviewScheduleFilter;
  onScheduleFilterChange: (v: InterviewScheduleFilter) => void;
};

const TYPE_OPTIONS: { value: InterviewType; label: string }[] = [
  { value: "all", label: UI_INTERVIEW_TYPE_ALL },
  { value: "ai", label: UI_INTERVIEW_TYPE_AI },
  { value: "regular", label: UI_INTERVIEW_TYPE_REGULAR },
];

const SCHEDULE_OPTIONS = [
  { value: "scheduled", label: UI_INTERVIEW_SCHEDULED },
  { value: "ongoing", label: UI_INTERVIEW_ONGOING },
] as const;

const InterviewFilterBar = ({
  tab,
  onTabChange,
  counts,
  type,
  onTypeChange,
  typeCounts,
  scheduleFilter,
  onScheduleFilterChange,
}: Props) => {
  const isIncoming = tab === "incoming";
  const activeCount = (type !== "all" ? 1 : 0) + (scheduleFilter ? 1 : 0);

  const clearAll = () => {
    onTypeChange("all");
    onScheduleFilterChange(null);
  };

  return (
    <div className="filter-bar filter-bar-sections">
      <div className="filter-section filter-section-status">
        <div className="status-toggle-group">
          <button
            className={`status-toggle-btn${isIncoming ? " active" : ""}`}
            onClick={() => onTabChange("incoming")}
          >
            {UI_INTERVIEW_TAB_INCOMING} <span className="status-toggle-count">{counts.incoming}</span>
          </button>
          <button
            className={`status-toggle-btn${!isIncoming ? " active" : ""}`}
            onClick={() => onTabChange("no-show")}
          >
            {UI_INTERVIEW_TAB_NO_SHOW} <span className="status-toggle-count">{counts["no-show"]}</span>
          </button>
        </div>
      </div>

      {isIncoming && (
        <>
          <span className="section-divider" />

          <FilterPopover activeCount={activeCount}>
            <div className="filter-popover-group">
              <span className="filter-popover-label">Interview type</span>
              <div className="filter-popover-options">
                {TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`filter-option${type === opt.value ? " active" : ""}`}
                    onClick={() => onTypeChange(opt.value)}
                  >
                    {opt.label}
                    <span className="filter-option-count">{typeCounts[opt.value]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-popover-divider" />

            <div className="filter-popover-group">
              <span className="filter-popover-label">Schedule</span>
              <div className="filter-popover-options">
                {SCHEDULE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`filter-option${scheduleFilter === opt.value ? " active" : ""}`}
                    onClick={() =>
                      onScheduleFilterChange(scheduleFilter === opt.value ? null : opt.value)
                    }
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
        </>
      )}
    </div>
  );
};

export default InterviewFilterBar;
