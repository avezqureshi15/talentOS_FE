import { useState, useMemo } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import { SR_LABELS, MOCK_INTERVIEWERS, genWeekSchedule } from "./schedule-round-modal.constants";
import type { ScheduleRoundModalProps, Interviewer, ScheduleStep, TimeSlot, DaySchedule } from "./schedule-round-modal.types";
import "./schedule-round-modal.css";

export default function ScheduleRoundModal({ open, candidateName, candidateId, onClose, onScheduled }: ScheduleRoundModalProps) {
  const [step, setStep] = useState<ScheduleStep>(1);
  const [search, setSearch] = useState("");
  const [selectedInterviewer, setSelectedInterviewer] = useState<Interviewer | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ dayIdx: number; time: string } | null>(null);
  const [gmeetEnabled, setGmeetEnabled] = useState(false);

  const weekSchedule = useMemo(() => genWeekSchedule(), []);

  const filtered = useMemo(
    () => MOCK_INTERVIEWERS.filter((i) => i.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  const selectedDay: DaySchedule | null = selectedSlot ? weekSchedule[selectedSlot.dayIdx] : null;

  const slotTime = selectedSlot?.time ?? "";
  const slotDate = selectedDay ? `${selectedDay.day}, ${selectedDay.date}` : "";
  const interviewerName = selectedInterviewer?.name ?? "";
  const interviewerRole = selectedInterviewer?.role ?? "";

  const invitePreview = SR_LABELS.INVITE_PREVIEW
    .replace("{candidate}", candidateName)
    .replace("{interviewer}", interviewerName)
    .replace("{date}", slotDate)
    .replace("{time}", slotTime);

  const successSubtext = SR_LABELS.STEP_3_SUBTEXT
    .replace("{candidate}", candidateName)
    .replace("{interviewer}", interviewerName);

  const canProceedTo2 = selectedInterviewer && selectedSlot;
  const canProceedTo3 = canProceedTo2;

  const stepTitle = step === 1 ? SR_LABELS.STEP_1_TITLE : SR_LABELS.STEP_2_TITLE;
  const stepDesc = step === 1 ? SR_LABELS.STEP_1_DESC : SR_LABELS.STEP_2_DESC;

  const handleSlotClick = (dayIdx: number, timeSlot: TimeSlot) => {
    if (timeSlot.status === "unavailable") return;
    if (!timeSlot) return;
    setSelectedSlot((prev) => (prev?.dayIdx === dayIdx && prev?.time === timeSlot.time ? null : { dayIdx, time: timeSlot.time }));
  };

  const resetState = () => {
    setStep(1);
    setSearch("");
    setSelectedInterviewer(null);
    setSelectedSlot(null);
    setGmeetEnabled(true);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleDone = () => {
    onScheduled(candidateId);
    handleClose();
  };

  const renderStep1 = () => (
    <div className="sr-two-col">
      <div className="sr-left-col">
        <div className="sr-interviewer-search">
          <i className="bx bx-search sr-search-icon" />
          <input
            className="sr-search-input"
            placeholder={SR_LABELS.INTERVIEWER_PLACEHOLDER}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="sr-interviewer-list">
          {filtered.map((iv) => (
            <button
              key={iv.id}
              className={`sr-interviewer-item ${selectedInterviewer?.id === iv.id ? "sr-interviewer-item--selected" : ""}`}
              onClick={() => { setSelectedInterviewer(iv); setSearch(""); }}
              type="button"
            >
              <div className="sr-interviewer-avatar">{iv.name.charAt(0)}</div>
              <div className="sr-interviewer-info">
                <span className="sr-interviewer-name">{iv.name}</span>
                <span className="sr-interviewer-role">{iv.role}</span>
              </div>
              {selectedInterviewer?.id === iv.id && <i className="bx bx-check sr-interviewer-check" />}
            </button>
          ))}
        </div>
      </div>
      <div className="sr-right-col">
        {selectedInterviewer ? (
          <div className="sr-calendar-section">
            <span className="sr-section-label">{SR_LABELS.SELECT_SLOT}</span>
            <div className="sr-calendar-grid">
              {weekSchedule.map((day, dayIdx) => (
                <div key={day.date} className="sr-day-col">
                  <div className="sr-day-header">
                    <div className="sr-day-name">{day.day}</div>
                    <div className="sr-day-date">{day.date}</div>
                  </div>
                  {day.slots.map((ts) => (
                    <div
                      key={ts.time}
                      className={`sr-slot sr-slot--${ts.status} ${selectedSlot?.dayIdx === dayIdx && selectedSlot?.time === ts.time ? "sr-slot--selected" : ""}`}
                      onClick={() => handleSlotClick(dayIdx, ts)}
                    >
                      {ts.time}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="sr-empty-slots">{SR_LABELS.NO_INTERVIEWER}</div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
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
            <span className="sr-summary-value">{interviewerName} &middot; {interviewerRole}</span>
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
        <span className="sr-gmeet-label">
          <i className="bx bx-video" />
          {SR_LABELS.GMEET_TOGGLE}
        </span>
        <button
          className={`sr-toggle ${gmeetEnabled ? "sr-toggle--on" : ""}`}
          onClick={() => setGmeetEnabled((v) => !v)}
          type="button"
        >
          <span className="sr-toggle-knob" />
        </button>
      </div>

      <textarea
        className="sr-invite-preview"
        readOnly
        value={gmeetEnabled ? invitePreview : invitePreview.replace("A Google Meet link has", "A calendar invite has")}
      />
    </>
  );

  const renderStep3 = () => (
    <div className="sr-success">
      <div className="sr-success-icon">
        <i className="bx bx-check" />
      </div>
      <div className="sr-success-title">{SR_LABELS.STEP_3_SUCCESS}</div>
      <div className="sr-success-sub">{successSubtext}</div>
    </div>
  );

  const title = step < 3 ? stepTitle : undefined;

  return (
    <BaseModal open={open} onClose={handleClose} title={title} className="sr-modal">
      <div className="sr-body">
        {step < 3 && (
          <div className="sr-step-indicator">
            {([1, 2] as ScheduleStep[]).map((s) => (
              <div key={s} className={`sr-dot ${step === s ? "sr-dot--active" : ""}`} />
            ))}
          </div>
        )}

        {step < 3 && (
          <div className="sr-step-header">
            <span className="sr-step-desc">{stepDesc}</span>
          </div>
        )}

        <div className="sr-content">
          {step === 1 && renderStep1()}
          {step === 2 && <div className="sr-scroll-content">{renderStep2()}</div>}
          {step === 3 && <div className="sr-scroll-content">{renderStep3()}</div>}
        </div>

        <div className="sr-actions">
          {step === 2 && (
            <button className="sr-btn sr-btn--back" onClick={() => setStep(1)} type="button">
              {SR_LABELS.BACK}
            </button>
          )}
          {step === 1 && (
            <button className="sr-btn sr-btn--primary" disabled={!canProceedTo2} onClick={() => setStep(2)} type="button">
              {SR_LABELS.NEXT}
            </button>
          )}
          {step === 2 && (
            <button className="sr-btn sr-btn--primary" disabled={!canProceedTo3} onClick={() => setStep(3)} type="button">
              {SR_LABELS.SEND_INVITE}
            </button>
          )}
          {step === 3 && (
            <button className="sr-btn sr-btn--done" onClick={handleDone} type="button">
              <i className="bx bx-check" /> {SR_LABELS.DONE}
            </button>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
