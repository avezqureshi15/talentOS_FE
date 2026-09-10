import {
  UI_INTERVIEW_AI_INCOMING,
  UI_INTERVIEW_REGULAR_INCOMING,
  UI_INTERVIEW_NO_SHOW,
  UI_INTERVIEW_SCHEDULED,
  UI_INTERVIEW_ONGOING,
} from "./detail.constants";

export type InterviewScheduleFilter = "scheduled" | "ongoing" | null;

type Props = {
  value: "ai-incoming" | "regular-incoming" | "no-show";
  onChange: (v: "ai-incoming" | "regular-incoming" | "no-show") => void;
  counts: { "ai-incoming": number; "regular-incoming": number; "no-show": number };
  scheduleFilter: InterviewScheduleFilter;
  onScheduleFilterChange: (v: InterviewScheduleFilter) => void;
};

const SCHEDULE_OPTIONS = [
  { value: "scheduled", label: UI_INTERVIEW_SCHEDULED },
  { value: "ongoing", label: UI_INTERVIEW_ONGOING },
] as const;

const InterviewFilterBar = ({ value, onChange, counts, scheduleFilter, onScheduleFilterChange }: Props) => {
  const showScheduleChips = value === "regular-incoming";

  return (
    <div className="filter-bar filter-bar-sections">
      <div className="filter-section filter-section-status">
        <div className="status-toggle-group">
          <button
            className={`status-toggle-btn${value === "ai-incoming" ? " active" : ""}`}
            onClick={() => onChange("ai-incoming")}
          >
            {UI_INTERVIEW_AI_INCOMING} <span className="status-toggle-count">{counts["ai-incoming"]}</span>
          </button>
          <button
            className={`status-toggle-btn${value === "regular-incoming" ? " active" : ""}`}
            onClick={() => onChange("regular-incoming")}
          >
            {UI_INTERVIEW_REGULAR_INCOMING} <span className="status-toggle-count">{counts["regular-incoming"]}</span>
          </button>
          <button
            className={`status-toggle-btn${value === "no-show" ? " active" : ""}`}
            onClick={() => onChange("no-show")}
          >
            {UI_INTERVIEW_NO_SHOW} <span className="status-toggle-count">{counts["no-show"]}</span>
          </button>
        </div>
      </div>

      {showScheduleChips && (
        <>
          <span className="section-divider" />

          <div className="filter-section filter-section-schedule">
            <span className="schedule-label">Schedule:</span>
            <div className="schedule-chips">
              {SCHEDULE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`schedule-chip${scheduleFilter === opt.value ? " active" : ""}`}
                  onClick={() =>
                    onScheduleFilterChange(scheduleFilter === opt.value ? null : opt.value)
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InterviewFilterBar;
