import { useState, useMemo, useRef, useCallback } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import SrStep1 from "./sr-step1";
import SrStep2 from "./sr-step2";
import { SR_LABELS, MOCK_INTERVIEWERS, genWeekSchedule } from "./schedule-round-modal.constants";
import type { ScheduleRoundModalProps, Interviewer, ScheduleStep, TimeSlot } from "./schedule-round-modal.types";
import "./schedule-round-modal.css";

export default function ScheduleRoundModal({ open, candidateName, candidateId, onClose, onScheduled }: ScheduleRoundModalProps) {
  const [step, setStep] = useState<ScheduleStep>(1);
  const [search, setSearch] = useState("");
  const [selectedInterviewer, setSelectedInterviewer] = useState<Interviewer | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ dayIdx: number; time: string } | null>(null);
  const [gmeetEnabled, setGmeetEnabled] = useState(false);
  // justification: stores the user-editable round title
  const [roundTitle, setRoundTitle] = useState(SR_LABELS.ROUND_TITLE_DEFAULT);
  // justification: tracks whether the round title is being edited inline
  const [editingTitle, setEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  const weekSchedule = useMemo(() => genWeekSchedule(), []);
  const filtered = useMemo(() => MOCK_INTERVIEWERS.filter((i) => i.name.toLowerCase().includes(search.toLowerCase())), [search]);

  const selectedDay = selectedSlot ? weekSchedule[selectedSlot.dayIdx] : null;
  const slotTime = selectedSlot?.time ?? "";
  const slotDate = selectedDay ? `${selectedDay.day}, ${selectedDay.date}` : "";
  const interviewerName = selectedInterviewer?.name ?? "";
  const interviewerRole = selectedInterviewer?.role ?? "";

  const invitePreview = SR_LABELS.INVITE_PREVIEW
    .replace("{candidate}", candidateName)
    .replace("{interviewer}", interviewerName)
    .replace("{date}", slotDate)
    .replace("{time}", slotTime);

  const canProceedTo2 = selectedInterviewer && selectedSlot;
  const canProceedTo3 = canProceedTo2;
  const stepDesc = step === 1 ? SR_LABELS.STEP_1_DESC : SR_LABELS.STEP_2_DESC;

  const handleSlotClick = (dayIdx: number, timeSlot: TimeSlot) => {
    if (timeSlot.status === "unavailable") return;
    setSelectedSlot((prev) => (prev?.dayIdx === dayIdx && prev?.time === timeSlot.time ? null : { dayIdx, time: timeSlot.time }));
  };

  const handleSelectInterviewer = (iv: Interviewer) => {
    setSelectedInterviewer(iv);
    setSearch("");
  };

  const startEditTitle = useCallback(() => {
    setEditingTitle(true);
    requestAnimationFrame(() => titleInputRef.current?.select());
  }, []);

  const finishEditTitle = useCallback(() => {
    setEditingTitle(false);
    setRoundTitle((prev) => prev.trim() || SR_LABELS.ROUND_TITLE_DEFAULT);
  }, []);

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") finishEditTitle();
    if (e.key === "Escape") { setRoundTitle(SR_LABELS.ROUND_TITLE_DEFAULT); setEditingTitle(false); }
  };

  const resetState = () => {
    setStep(1);
    setSearch("");
    setSelectedInterviewer(null);
    setSelectedSlot(null);
    setGmeetEnabled(true);
  };

  const handleClose = () => { resetState(); onClose(); };
  const handleDone = () => { onScheduled(candidateId); handleClose(); };
  const nextStep = () => setStep((s) => (s + 1) as ScheduleStep);
  const successSubtext = SR_LABELS.STEP_3_SUBTEXT.replace("{candidate}", candidateName).replace("{interviewer}", interviewerName);

  return (
    <BaseModal open={open} onClose={handleClose} className="sr-modal">
      <div className="sr-body">
        <div className="sr-title-row">
          {editingTitle ? (
            <input
              ref={titleInputRef}
              className="sr-round-title-input"
              value={roundTitle}
              onChange={(e) => setRoundTitle(e.target.value)}
              onBlur={finishEditTitle}
              onKeyDown={handleTitleKeyDown}
              autoFocus
            />
          ) : (
            <span className="sr-round-title" onClick={startEditTitle} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") startEditTitle(); }}>
              {roundTitle} <i className="bx bx-pencil" />
            </span>
          )}
        </div>

        {step < 3 && (
          <div className="sr-step-indicator">
            {([1, 2] as ScheduleStep[]).map((s) => (<div key={s} className={`sr-dot ${step === s ? "sr-dot--active" : ""}`} />))}
          </div>
        )}

        {step < 3 && <div className="sr-step-header"><span className="sr-step-desc">{stepDesc}</span></div>}

        <div className="sr-content">
          {step === 1 && <SrStep1 search={search} onSearchChange={setSearch} filtered={filtered} selectedInterviewer={selectedInterviewer} onSelectInterviewer={handleSelectInterviewer} weekSchedule={weekSchedule} selectedSlot={selectedSlot} onSlotClick={handleSlotClick} />}
          {step === 2 && <div className="sr-scroll-content"><SrStep2 candidateName={candidateName} interviewerName={interviewerName} interviewerRole={interviewerRole} slotDate={slotDate} slotTime={slotTime} gmeetEnabled={gmeetEnabled} onToggleGmeet={() => setGmeetEnabled((v) => !v)} invitePreview={invitePreview} /></div>}
          {step === 3 && (
            <div className="sr-scroll-content">
              <div className="sr-success">
                <div className="sr-success-icon"><i className="bx bx-check" /></div>
                <div className="sr-success-title">{SR_LABELS.STEP_3_SUCCESS}</div>
                <div className="sr-success-sub">{successSubtext}</div>
              </div>
            </div>
          )}
        </div>

        <div className="sr-actions">
          {step === 2 && <button className="sr-btn sr-btn--back" onClick={() => setStep(1)} type="button">{SR_LABELS.BACK}</button>}
          {step === 1 && <button className="sr-btn sr-btn--primary" disabled={!canProceedTo2} onClick={nextStep} type="button">{SR_LABELS.NEXT}</button>}
          {step === 2 && <button className="sr-btn sr-btn--primary" disabled={!canProceedTo3} onClick={nextStep} type="button">{SR_LABELS.SEND_INVITE}</button>}
          {step === 3 && <button className="sr-btn sr-btn--done" onClick={handleDone} type="button"><i className="bx bx-check" /> {SR_LABELS.DONE}</button>}
        </div>
      </div>
    </BaseModal>
  );
}
