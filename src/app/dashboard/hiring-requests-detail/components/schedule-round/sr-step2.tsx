import { useMemo } from "react";
import { SR_LABELS } from "./schedule-round-modal.constants";

type SrStep2Props = {
  candidateName: string;
  interviewerNames: string;
  slotDate: string;
  slotTime: string;
  gmeetEnabled: boolean;
  onToggleGmeet: () => void;
  invitePreview: string;
  isAiMode?: boolean;
  scheduledDate?: string;
  scheduledTime?: string;
  onScheduledDateChange?: (date: string) => void;
  onScheduledTimeChange?: (time: string) => void;
};

const TIME_SLOTS = Array.from({ length: 19 }, (_, i) => {
  const h = Math.floor(i / 2) + 9;
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

const TODAY = new Date().toISOString().split("T")[0];

const SrStep2 = ({ candidateName, interviewerNames, slotDate, slotTime, gmeetEnabled, onToggleGmeet, invitePreview, isAiMode, scheduledDate, scheduledTime, onScheduledDateChange, onScheduledTimeChange }: SrStep2Props) => {
  const timeSlots = useMemo(() => TIME_SLOTS, []);

  if (isAiMode) {
    return (
      <div className="sr-two-col">
        <div className="sr-left-col" style={{ flex: "0 0 50%", maxWidth: "none", overflowY: "auto" }}>
          <div className="sr-summary">
            <div className="sr-summary-row">
              <div className="sr-summary-icon"><i className="bx bx-user" /></div>
              <div className="sr-summary-content">
                <span className="sr-summary-label">{SR_LABELS.CANDIDATE_LABEL}</span>
                <span className="sr-summary-value">{candidateName}</span>
              </div>
            </div>
            <div className="sr-summary-row">
              <div className="sr-summary-icon"><i className="bx bx-briefcase" /></div>
              <div className="sr-summary-content">
                <span className="sr-summary-label">{SR_LABELS.INTERVIEWER_LABEL}</span>
                <span className="sr-summary-value">{interviewerNames}</span>
              </div>
            </div>
            <div className="sr-summary-row" style={{ padding: "16px 14px 12px", flexDirection: "column", alignItems: "stretch", gap: 12 }}>
              <div className="sr-ai-schedule-section">
                <span className="sr-section-label">{SR_LABELS.AI_SCHEDULE_HEADER}</span>
                <input
                  type="date"
                  className="sr-ai-date-input"
                  value={scheduledDate ?? ""}
                  min={TODAY}
                  onChange={(e) => onScheduledDateChange?.(e.target.value)}
                />
              </div>
            </div>
          </div>

          {scheduledDate && scheduledTime && (
            <div className="sr-summary" style={{ marginTop: 8 }}>
              <div className="sr-summary-row">
                <div className="sr-summary-icon"><i className="bx bx-calendar" /></div>
                <div className="sr-summary-content">
                  <span className="sr-summary-label">{SR_LABELS.DATE_LABEL}</span>
                  <span className="sr-summary-value">{scheduledDate}</span>
                </div>
              </div>
              <div className="sr-summary-row">
                <div className="sr-summary-icon"><i className="bx bx-stopwatch" /></div>
                <div className="sr-summary-content">
                  <span className="sr-summary-label">{SR_LABELS.TIME_LABEL}</span>
                  <span className="sr-summary-value">{scheduledTime}</span>
                </div>
              </div>
            </div>
          )}

          {invitePreview && (
            <textarea className="sr-invite-preview" readOnly value={invitePreview} />
          )}
        </div>
        <div className="sr-right-col">
          <div className="sr-right-col-scroll">
            <div className="sr-ai-schedule-section" style={{ padding: "16px 14px 8px" }}>
              <span className="sr-section-label">{SR_LABELS.AI_SCHEDULE_TIME}</span>
              <div className="sr-ai-time-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                {timeSlots.map((t) => (
                  <button
                    key={t}
                    className={`sr-ai-time-slot${scheduledTime === t ? " sr-ai-time-slot--selected" : ""}`}
                    onClick={() => onScheduledTimeChange?.(t)}
                    type="button"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="sr-ai-schedule-section" style={{ padding: "0 14px 16px" }}>
              <span className="sr-section-label">Or enter custom time</span>
              <input
                type="time"
                className="sr-ai-time-input"
                value={scheduledTime ?? ""}
                onChange={(e) => onScheduledTimeChange?.(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sr-summary">
        <div className="sr-summary-row">
          <div className="sr-summary-icon"><i className="bx bx-user" /></div>
          <div className="sr-summary-content">
            <span className="sr-summary-label">{SR_LABELS.CANDIDATE_LABEL}</span>
            <span className="sr-summary-value">{candidateName}</span>
          </div>
        </div>
        <div className="sr-summary-row">
          <div className="sr-summary-icon"><i className="bx bx-briefcase" /></div>
          <div className="sr-summary-content">
            <span className="sr-summary-label">{SR_LABELS.INTERVIEWER_LABEL}</span>
            <span className="sr-summary-value">{interviewerNames}</span>
          </div>
        </div>
        <div className="sr-summary-row">
          <div className="sr-summary-icon"><i className="bx bx-calendar" /></div>
          <div className="sr-summary-content">
            <span className="sr-summary-label">{SR_LABELS.DATE_LABEL}</span>
            <span className="sr-summary-value">{slotDate}</span>
          </div>
        </div>
        <div className="sr-summary-row">
          <div className="sr-summary-icon"><i className="bx bx-stopwatch" /></div>
          <div className="sr-summary-content">
            <span className="sr-summary-label">{SR_LABELS.TIME_LABEL}</span>
            <span className="sr-summary-value">{slotTime}</span>
          </div>
        </div>
      </div>

      <hr className="sr-gmeet-divider" />
      <div className="sr-gmeet-row">
        <span className="sr-gmeet-label"><i className="bx bx-video" /> {SR_LABELS.GMEET_TOGGLE}</span>
        <button className={`sr-toggle ${gmeetEnabled ? "sr-toggle--on" : ""}`} onClick={onToggleGmeet} type="button">
          <span className="sr-toggle-knob" />
        </button>
      </div>

      {invitePreview && (
        <textarea className="sr-invite-preview" readOnly value={invitePreview} />
      )}
    </>
  );
};

export default SrStep2;
