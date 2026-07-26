import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import { useInterviewerSlots } from "@/hooks/use-interviewer-slots";
import { useInterviewerSearch } from "@/hooks/use-interviewer-search";
import { useBookInterview } from "@/hooks/use-book-interview";
import { useRescheduleInterview } from "@/hooks/use-reschedule-interview";
import SrStep1 from "./sr-step1";
import SrStep2 from "./sr-step2";
import { SR_LABELS, AI_ID, AI_SCREENING_ID, AI_TEMPLATES } from "./schedule-round-modal.constants";
import { useTriggerAiInterview } from "@/hooks/use-trigger-ai-interview";
import type { ScheduleRoundModalProps, Interviewer, ScheduleStep } from "./schedule-round-modal.types";
import "./schedule-round-modal.css";

export default function ScheduleRoundModal({ open, candidateName, candidateId, candidateNumberId, jdId, interviewId, interviewerEmpId, interviewerName, roundName, rescheduleMode, hiringRequestId, onClose, onScheduled }: ScheduleRoundModalProps) {
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

  const aiScreeningActive = selectedInterviewers.some((s) => s.id === AI_SCREENING_ID);

  // justification: pre-populate the interviewer for reschedule mode — we use the emp_id from the existing interview
  useEffect(() => {
    if (!rescheduleMode || !interviewerEmpId) return;
    setSelectedInterviewers([{
      id: interviewerEmpId,
      emp_id: interviewerEmpId,
      name: "Existing Interviewer",
      designation: "",
      department: "",
      email: "",
      slots_count: 0,
      has_slots: true,
    }]);
  }, [rescheduleMode, interviewerEmpId]);

  const { data: searchData, isLoading: isSearching } = useInterviewerSearch(!rescheduleMode ? search : "");

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

  // skip slot API call when AI interviewer or AI Screening is the active interviewer
  const slotFetchId = activeInterviewerId === AI_ID || activeInterviewerId === AI_SCREENING_ID ? null : activeInterviewerId;

  const { data: activeSlots, isLoading } = useInterviewerSlots(slotFetchId);

  // check if the selected slot is a template slot or AI screening
  const isTemplateSlot = selectedSlotId?.startsWith("ai-") && !selectedSlotId?.startsWith("ai-screening-");

  // when AI is the only selected interviewer, show templates instead of virtual slot
  const aiActive = selectedInterviewers.some((s) => s.id === AI_ID) && activeInterviewerId === AI_ID;

  const allSlots = useMemo(() => {
    if (isTemplateSlot) return [];
    return activeSlots ?? [];
  }, [isTemplateSlot, activeSlots]);

  const selectedSlotData = selectedSlotId && allSlots ? allSlots.find((s) => s.id === selectedSlotId) : null;
  const slotTime = aiScreeningActive ? "AI Scheduled" : (selectedSlotData?.label ?? "");
  const slotDate = aiScreeningActive ? "AI Interview Session" : (selectedSlotData?.description ?? "");
  const interviewerNames = selectedInterviewers.map((iv) => iv.name).join(", ");

  const invitePreview = aiScreeningActive
    ? `An AI interview session will be created for ${candidateName}. The candidate will receive an invitation link to join the AI-powered interview.`
    : SR_LABELS.INVITE_PREVIEW
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
    if (iv.id === AI_ID || iv.id === AI_SCREENING_ID) {
      const isNowSelected = !selectedInterviewers.some((s) => s.id === iv.id);
      if (isNowSelected) {
        if (iv.id === AI_SCREENING_ID) setSelectedSlotId("ai-screening-confirmed");
      } else {
        setSelectedSlotId(null);
      }
    } else {
      if (selectedInterviewers.some((s) => s.id === iv.id)) {
        setSelectedSlotId((prev) => (prev === iv.id ? null : prev));
      }
    }
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
  const { mutateAsync: rescheduleInterviewMut, isPending: isRescheduling } = useRescheduleInterview();
  const { mutateAsync: triggerAiInterviewMut, isPending: isTriggeringAi } = useTriggerAiInterview();

  const isPending = isBooking || isRescheduling || isTriggeringAi;

  const handleClose = () => { resetState(); onClose(); };
  const handleDone = () => { onScheduled(candidateId); handleClose(); };
  const nextStep = () => setStep((s) => (s + 1) as ScheduleStep);

  const doReschedule = async () => {
    if (!selectedSlotId || !interviewId) return;
    try {
      await rescheduleInterviewMut({ interviewId, slot_id: selectedSlotId });
    } catch {
      return;
    }
    setStep(3);
  };

  const doBook = async () => {
    if (!selectedSlotId || selectedInterviewers.length === 0) return;
    if (aiScreeningActive && hiringRequestId && candidateNumberId) {
      try {
        await triggerAiInterviewMut({
          hiringRequestId,
          candidateId: candidateNumberId,
          round_name: roundTitle,
          interview_type: "AI_INTERVIEW",
          round_type: "AI_INTERVIEW",
        });
      } catch {
        return;
      }
      setShowNameConfirm(false);
      nextStep();
      return;
    }
    if (jdId && candidateNumberId) {
      try {
        await bookInterview({
          round_name: roundTitle,
          slot_id: selectedSlotId,
          jd_id: jdId,
          candidate_id: candidateNumberId,
          interviewer_ids: selectedInterviewers.filter((iv) => iv.id !== AI_ID).map((iv) => Number(iv.id)),
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
    if (rescheduleMode) {
      await doReschedule();
      return;
    }
    if (aiScreeningActive) {
      await doBook();
      return;
    }
    if (roundTitle === SR_LABELS.ROUND_TITLE_DEFAULT) {
      setShowNameConfirm(true);
      return;
    }
    await doBook();
  };

  const successTitle = rescheduleMode ? SR_LABELS.STEP_3_RESCHEDULE_SUCCESS : SR_LABELS.STEP_3_SUCCESS;
  const successSubtext = SR_LABELS.STEP_3_SUBTEXT.replace("{candidate}", candidateName).replace("{interviewer}", interviewerNames);

  return (
    <BaseModal open={open} onClose={handleClose} className="sr-modal">
      <div className="sr-body">
        {!rescheduleMode && (
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
        )}

        {!rescheduleMode && (
          <>
            {!showNameConfirm && step < 3 && (
              <div className="sr-step-indicator">
                {([1, 2] as ScheduleStep[]).map((s) => (<div key={s} className={`sr-dot ${step === s ? "sr-dot--active" : ""}`} />))}
              </div>
            )}
            {!showNameConfirm && step < 3 && <div className="sr-step-header"><span className="sr-step-desc">{stepDesc}</span></div>}
          </>
        )}

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
                  <button className="sr-btn sr-btn--back" onClick={() => { setShowNameConfirm(false); startEditTitle(); }} type="button">Edit Name</button>
                  <Button className="sr-btn sr-btn--primary" onClick={doBook} loading={isPending} loadingText="Sending...">
                    Keep & Send
                  </Button>
                </div>
              </div>
            </div>
          ) : (<>
            {step === 1 && rescheduleMode && (
              <div className="sr-reschedule-layout">
                <div className="sr-reschedule-left">
                  <div className="sr-reschedule-title"><i className="bx bx-calendar" /> {roundName || "Interview"}</div>
                  <div className="sr-participant-row">
                    <span className="sr-participant-label">{SR_LABELS.INTERVIEWER_LABEL}</span>
                    <span className="sr-participant-value"><i className="bx bx-user" /> {interviewerName || SR_LABELS.INTERVIEWER_LABEL}</span>
                  </div>
                  <div className="sr-participant-row">
                    <span className="sr-participant-label">{SR_LABELS.CANDIDATE_LABEL}</span>
                    <span className="sr-participant-value"><i className="bx bx-user" /> {candidateName}</span>
                  </div>
                </div>
                <div className="sr-reschedule-right">
                  <SrStep1 search={search} onSearchChange={setSearch} interviewers={interviewers}
                    selectedInterviewers={selectedInterviewers} onSelectInterviewer={handleSelectInterviewer}
                    tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange}
                    activeSlots={allSlots} selectedSlotId={selectedSlotId} onSlotSelect={handleSlotSelect}
                    isLoading={isLoading} isSearching={false} hideSearch={true}
                    aiTemplates={aiActive ? AI_TEMPLATES : undefined} />
                </div>
              </div>
            )}
            {step === 1 && !rescheduleMode && <SrStep1 search={search} onSearchChange={setSearch} interviewers={interviewers}
              selectedInterviewers={selectedInterviewers} onSelectInterviewer={handleSelectInterviewer}
              tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange}
              activeSlots={allSlots} selectedSlotId={selectedSlotId} onSlotSelect={handleSlotSelect}
              isLoading={isLoading} isSearching={isSearching} hideSearch={false}
              aiTemplates={aiActive ? AI_TEMPLATES : undefined} />}
            {step === 2 && !rescheduleMode && <div className="sr-scroll-content"><SrStep2 candidateName={candidateName}
              interviewerNames={interviewerNames} slotDate={slotDate} slotTime={slotTime}
              gmeetEnabled={gmeetEnabled} onToggleGmeet={() => setGmeetEnabled((v) => !v)}
              invitePreview={invitePreview} /></div>}
            {step === 3 && (
              <div className="sr-scroll-content">
                <div className="sr-success">
                  <div className="sr-success-icon"><i className="bx bx-check" /></div>
                  <div className="sr-success-title">{successTitle}</div>
                  <div className="sr-success-sub">{successSubtext}</div>
                </div>
              </div>
            )}
          </>)}
        </div>

        <div className="sr-actions">
          {!showNameConfirm && step === 2 && !rescheduleMode && <button className="sr-btn sr-btn--back" onClick={() => setStep(1)} type="button">{SR_LABELS.BACK}</button>}
          {!showNameConfirm && step === 1 && (rescheduleMode ? (
            <Button className="sr-btn sr-btn--primary" disabled={!canProceedTo2} onClick={handleSendInvite} loading={isPending} loadingText={SR_LABELS.RESCHEDULING_LABEL}>
              {SR_LABELS.RESCHEDULE_CONFIRM}
            </Button>
          ) : (
            <button className="sr-btn sr-btn--primary" disabled={!canProceedTo2} onClick={nextStep} type="button">{SR_LABELS.NEXT}</button>
          ))}
          {!showNameConfirm && step === 2 && !rescheduleMode && (
            <Button className="sr-btn sr-btn--primary" disabled={!canProceedTo3} onClick={handleSendInvite} loading={isPending} loadingText="Sending...">
              {SR_LABELS.SEND_INVITE}
            </Button>
          )}
          {!showNameConfirm && step === 3 && <button className="sr-btn sr-btn--done" onClick={handleDone} type="button"><i className="bx bx-check" /> {SR_LABELS.DONE}</button>}
        </div>
      </div>
    </BaseModal>
  );
}
