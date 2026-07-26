import { UI_INTERVIEW_YET_TO_START, UI_INTERVIEW_NO_SHOW } from "./detail.constants";

type Props = {
  value: "yet-to-start" | "no-show";
  onChange: (v: "yet-to-start" | "no-show") => void;
};

const InterviewFilterBar = ({ value, onChange }: Props) => (
  <div className="filter-bar filter-bar-sections">
    <div className="filter-section filter-section-status">
      <div className="status-toggle-group">
        <button
          className={`status-toggle-btn${value === "yet-to-start" ? " active" : ""}`}
          onClick={() => onChange("yet-to-start")}
        >
          {UI_INTERVIEW_YET_TO_START}
        </button>
        <button
          className={`status-toggle-btn${value === "no-show" ? " active" : ""}`}
          onClick={() => onChange("no-show")}
        >
          {UI_INTERVIEW_NO_SHOW}
        </button>
      </div>
    </div>
  </div>
);

export default InterviewFilterBar;
