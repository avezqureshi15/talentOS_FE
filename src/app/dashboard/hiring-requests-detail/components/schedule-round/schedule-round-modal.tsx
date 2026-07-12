import { useState, useMemo, useRef, useCallback } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import { useInterviewerSlots } from "@/hooks/use-interviewer-slots";
import { useInterviewerSearch } from "@/hooks/use-interviewer-search";
import { useBookInterview } from "@/hooks/use-book-interview";
import SrStep1 from "./sr-step1";
import SrStep2 from "./sr-step2";
import { SR_LABELS } from "./schedule-round-modal.constants";
import type { ScheduleRoundModalProps, Interviewer, ScheduleStep } from "./schedule-round-modal.types";
import "./schedule-round-modal.css";

export default function ScheduleRoundModal({ open, candidateName, candidateId, candidateNumberId, jdId, onClose, onScheduled }: ScheduleRoundModalProps) {
  const [step, setStep] = useState<ScheduleStep>(1);
  const [search, setSearch] = useState("");
  // justification: stores multiple selected interviewers for a round
  const [selectedInterviewers, setSelectedInterviewers] = useState<Interviewer[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  // justification: tracks which interviewer tab is active for slot view
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [gmeetEnabled, setGmeetEnabled] = useState(true);
  // justification: stores the user-editable round title
  const [roundTitle, setRoundTitle] = useState(SR_LABELS.ROUND_TITLE_DEFAULT);
  // justification: tracks whether the round title is being edited inline
  const [editingTitle, setEditingTitle] = useState(false);
  // justification: shows an inline confirmation when round name is still the default
  const [showNameConfirm, setShowNameConfirm] = useState(false);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  const { data: searchData, isLoading: isSearching } = useInterviewerSearch(search);

  const interviewers = useMemo(() => (searchData?.data ?? []).map((u) => ({
    id: String(u.id),
    emp_id: u.emp_id,
    name: u.name,
    designation: u.designation,
    department: u.department,
    email: u.email,
    slots_count: u.slots_count ?? 0,
    has_slots: u.has_slots ?? false,
  })), [searchData]);

  // tab definitions: one per selected interviewer
  const tabs = useMemo(() => {
    if (selectedInterviewers.length < 2) return [];
    return selectedInterviewers.map((iv) => ({ id: iv.id, label: iv.name }));
  }, [selectedInterviewers]);

  // which interviewer's slots to fetch — single mode or tab-selected
  const activeInterviewerId = useMemo(() => {
    if (selectedInterviewers.length === 1) return selectedInterviewers[0].id;
    if (selectedInterviewers.length > 1 && activeTab) return activeTab;
    return null;
  }, [selectedInterviewers, activeTab]);

  const { data: activeSlots, isLoading } = useInterviewerSlots(activeInterviewerId);

  const selectedSlotData = selectedSlotId && activeSlots ? activeSlots.find((s) => s.id === selectedSlotId) : null;
  const slotTime = selectedSlotData?.label ?? "";
  const slotDate = selectedSlotData?.description ?? "";
  const interviewerNames = selectedInterviewers.map((iv) => iv.name).join(", ");

  const invitePreview = SR_LABELS.INVITE_PREVIEW
    .replace("{candidate}", candidateName)
    .replace("{interviewer}", interviewerNames)
    .replace("{date}", slotDate)
    .replace("{time}", slotTime);

  const canProceedTo2 = selectedInterviewers.length > 0 && !!selectedSlotId;
  const canProceedTo3 = canProceedTo2;
  const stepDesc = step === 1 ? SR_LABELS.STEP_1_DESC : SR_LABELS.STEP_2_DESC;

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId((prev) => (prev === slotId ? null : slotId));
  };

  const handleSelectInterviewer = (iv: Interviewer) => {
    setSelectedInterviewers((prev) => {
      const exists = prev.find((s) => s.id === iv.id);
      return exists ? prev.filter((s) => s.id !== iv.id) : [...prev, iv];
    });
    setSearch("");
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedSlotId(null);
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
    setSelectedInterviewers([]);
    setSelectedSlotId(null);
    setActiveTab(null);
    setGmeetEnabled(true);
    setShowNameConfirm(false);
  };

  const { mutateAsync: bookInterview, isPending: isBooking } = useBookInterview();

  const handleClose = () => { resetState(); onClose(); };
  const handleDone = () => { onScheduled(candidateId); handleClose(); };
  const nextStep = () => setStep((s) => (s + 1) as ScheduleStep);

  const doBook = async () => {
    if (!selectedSlotId || selectedInterviewers.length === 0) return;
    if (jdId && candidateNumberId) {
      try {
        await bookInterview({
          round_name: roundTitle,
          slot_id: selectedSlotId,
          jd_id: jdId,
          candidate_id: candidateNumberId,
          interviewer_ids: selectedInterviewers.map((iv) => Number(iv.id)),
          create_google_meet: gmeetEnabled,
        });
      } catch {
        return;
      }
    }
    setShowNameConfirm(false);
    nextStep();
  };

  const handleSendInvite = async () => {
    if (!selectedSlotId || selectedInterviewers.length === 0) return;
    if (roundTitle === SR_LABELS.ROUND_TITLE_DEFAULT) {
      setShowNameConfirm(true);
      return;
    }
    await doBook();
  };

  const successSubtext = SR_LABELS.STEP_3_SUBTEXT.replace("{candidate}", candidateName).replace("{interviewer}", interviewerNames);

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

        {!showNameConfirm && step < 3 && (
          <div className="sr-step-indicator">
            {([1, 2] as ScheduleStep[]).map((s) => (<div key={s} className={`sr-dot ${step === s ? "sr-dot--active" : ""}`} />))}
          </div>
        )}

        {!showNameConfirm && step < 3 && <div className="sr-step-header"><span className="sr-step-desc">{stepDesc}</span></div>}

        <div className="sr-content">
          {showNameConfirm ? (
            <div className="sr-scroll-content">
              <div className="sr-name-confirm">
                <div className="sr-name-confirm-icon"><i className="bx bx-info-circle" /></div>
                <div className="sr-name-confirm-title">Confirm Round Name</div>
                <div className="sr-name-confirm-desc">
                  The round name is currently <strong>"{SR_LABELS.ROUND_TITLE_DEFAULT}"</strong>.
                  Do you want to keep this name?
                </div>
                <div className="sr-name-confirm-actions">
                  <button className="sr-btn sr-btn--back" onClick={() => setShowNameConfirm(false)} type="button">Edit Name</button>
                  <button className="sr-btn sr-btn--primary" onClick={doBook} type="button" disabled={isBooking}>
                    {isBooking ? "Sending..." : "Keep & Send"}
                  </button>
                </div>
              </div>
            </div>
          ) : (<>
            {step === 1 && <SrStep1 search={search} onSearchChange={setSearch} interviewers={interviewers}
              selectedInterviewers={selectedInterviewers} onSelectInterviewer={handleSelectInterviewer}
              tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange}
              activeSlots={activeSlots ?? []} selectedSlotId={selectedSlotId} onSlotSelect={handleSlotSelect}
              isLoading={isLoading} isSearching={isSearching} />}
            {step === 2 && <div className="sr-scroll-content"><SrStep2 candidateName={candidateName}
              interviewerNames={interviewerNames} slotDate={slotDate} slotTime={slotTime}
              gmeetEnabled={gmeetEnabled} onToggleGmeet={() => setGmeetEnabled((v) => !v)}
              invitePreview={invitePreview} /></div>}
            {step === 3 && (
              <div className="sr-scroll-content">
                <div className="sr-success">
                  <div className="sr-success-icon"><i className="bx bx-check" /></div>
                  <div className="sr-success-title">{SR_LABELS.STEP_3_SUCCESS}</div>
                  <div className="sr-success-sub">{successSubtext}</div>
                </div>
              </div>
            )}
          </>)}
        </div>

        <div className="sr-actions">
          {!showNameConfirm && step === 2 && <button className="sr-btn sr-btn--back" onClick={() => setStep(1)} type="button">{SR_LABELS.BACK}</button>}
          {!showNameConfirm && step === 1 && <button className="sr-btn sr-btn--primary" disabled={!canProceedTo2} onClick={nextStep} type="button">{SR_LABELS.NEXT}</button>}
          {!showNameConfirm && step === 2 && <button className="sr-btn sr-btn--primary" disabled={!canProceedTo3 || isBooking} onClick={handleSendInvite} type="button">{isBooking ? "Sending..." : SR_LABELS.SEND_INVITE}</button>}
          {!showNameConfirm && step === 3 && <button className="sr-btn sr-btn--done" onClick={handleDone} type="button"><i className="bx bx-check" /> {SR_LABELS.DONE}</button>}
        </div>
      </div>
    </BaseModal>
  );
}
