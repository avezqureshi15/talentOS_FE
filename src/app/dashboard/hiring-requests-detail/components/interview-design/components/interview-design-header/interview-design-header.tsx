import { Clock, Save, X } from "lucide-react";
import { INTERVIEW_DESIGN_HEADER_LABELS } from "./interview-design-header.constants";
import type { InterviewDesignHeaderProps } from "./interview-design-header.types";
import "./interview-design-header.css";

export const InterviewDesignHeader = ({
  totalMinutes,
  targetMinutes,
  timeStatus,
  questionCount,
  isSaving,
  onSave,
  onClose,
}: InterviewDesignHeaderProps) => {
  const labels = INTERVIEW_DESIGN_HEADER_LABELS;
  return (
    <div className="idh-header">
      <div className="idh-title-row">
        <h2 className="idh-title">{labels.TITLE}</h2>
        <span className={`idh-time-pill idh-time-pill--${timeStatus}`}>
          <Clock size={13} />
          {totalMinutes} / {targetMinutes} {labels.MINUTES_SUFFIX}
        </span>
        <span className={`idh-status idh-status--${timeStatus}`}>
          {labels.TIME_STATUS_LABEL[timeStatus]}
        </span>
        <span className="idh-question-count">{questionCount} questions</span>
      </div>
      <div className="idh-actions">
        <button type="button" className="idh-btn idh-btn--ghost" onClick={onClose}>
          <X size={15} />
          {labels.CLOSE}
        </button>
        <button
          type="button"
          className="idh-btn idh-btn--primary"
          onClick={onSave}
          disabled={isSaving}
        >
          <Save size={15} />
          {isSaving ? labels.SAVING : labels.SAVE}
        </button>
      </div>
    </div>
  );
};
