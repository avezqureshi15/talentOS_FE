import { UI_INTERVIEW_YET_TO_START, UI_INTERVIEW_NO_SHOW } from "./detail.constants";

type Props = {
  value: "yet-to-start" | "no-show";
  onChange: (v: "yet-to-start" | "no-show") => void;
  counts: { "yet-to-start": number; "no-show": number };
};

const InterviewFilterBar = ({ value, onChange, counts }: Props) => (
  <div className="filter-bar filter-bar-sections">
    <div className="filter-section filter-section-status">
      <div className="status-toggle-group">
        <button
          className={`status-toggle-btn${value === "yet-to-start" ? " active" : ""}`}
          onClick={() => onChange("yet-to-start")}
        >
          {UI_INTERVIEW_YET_TO_START} <span className="status-toggle-count">{counts["yet-to-start"]}</span>
        </button>
        <button
          className={`status-toggle-btn${value === "no-show" ? " active" : ""}`}
          onClick={() => onChange("no-show")}
        >
          {UI_INTERVIEW_NO_SHOW} <span className="status-toggle-count">{counts["no-show"]}</span>
        </button>
      </div>
    </div>
  </div>
);

export default InterviewFilterBar;
