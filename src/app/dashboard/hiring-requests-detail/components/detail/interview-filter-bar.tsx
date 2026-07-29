import { UI_INTERVIEW_AI_INCOMING, UI_INTERVIEW_REGULAR_INCOMING, UI_INTERVIEW_NO_SHOW } from "./detail.constants";

type Props = {
  value: "ai-incoming" | "regular-incoming" | "no-show";
  onChange: (v: "ai-incoming" | "regular-incoming" | "no-show") => void;
  counts: { "ai-incoming": number; "regular-incoming": number; "no-show": number };
};

const InterviewFilterBar = ({ value, onChange, counts }: Props) => (
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
  </div>
);

export default InterviewFilterBar;
