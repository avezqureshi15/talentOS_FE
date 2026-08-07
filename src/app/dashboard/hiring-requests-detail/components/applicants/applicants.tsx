import { useState, useCallback } from "react";
import ApplicantCard from "./applicant-card";
import ApplicantActionModals from "./applicant-action-modals";
import CoverLetterModal from "@/app/dashboard/hiring-requests-detail/components/modal/cover-letter-modal";
import AiSummaryModal from "@/app/dashboard/hiring-requests-detail/components/modal/ai-summary-modal";
import ApplicantDetailsModal from "@/app/dashboard/hiring-requests-detail/components/modal/applicant-details-modal";
import ScheduleRoundModal from "@/app/dashboard/hiring-requests-detail/components/schedule-round/schedule-round-modal";
import AiInterviewScheduleModal from "@/app/dashboard/hiring-requests-detail/components/applicants/ai-interview-schedule-modal/ai-interview-schedule-modal";
import CancelInterviewModal from "@/app/dashboard/hiring-requests/components/interviews/cancel-interview-modal";
import { updateReviewByRound, updateFinalVerdict } from "@/services/reviews/reviews";
import { useMoveToScreening } from "@/hooks/use-move-to-screening";
import { useAiRetryScreening, useTriggerScreeningCall } from "@/hooks/use-ai-retry";
import { useUpdateCandidateRoundStatus } from "@/hooks/use-update-candidate-round-status";
import { useCancelInterview } from "@/hooks/use-cancel-interview";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";
import { useApplicantActions } from "./hooks/use-applicant-actions";
import type { Applicant, ApplicantStatus, AccordionTab, ApplicantsProps } from "./applicants.types";

type LocalOverride = {
  status?: ApplicantStatus;
  screening?: boolean;
  finalVerdict?: string;
};

function Applicants({ data: propData, openId, setOpenId, applicantParam, onRefresh, jdId, isRemote, showBulkSelection = false, selectedIds, onToggleSelect, onToggleSelectAll, allSelected, selectionCount = 0, onTimeline }: ApplicantsProps) {
  const [localOverrides, setLocalOverrides] = useState<Record<string, LocalOverride>>({});
  const [screeningId, setScreeningId] = useState<string | null>(null);
  const [coverLetterId, setCoverLetterId] = useState<string | null>(null);
  const [aiSummaryId, setAiSummaryId] = useState<string | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [accordionTab, setAccordionTab] = useState<AccordionTab>("details");
  const [finalCandidateId, setFinalCandidateId] = useState<string | null>(null);
  const [finalDecision, setFinalDecision] = useState<"selected" | "on-hold" | "rejected" | null>(null);
  const [rejectConfirmId, setRejectConfirmId] = useState<string | null>(null);
  const [rejectRemarks, setRejectRemarks] = useState("");
  const [rejectStep, setRejectStep] = useState<1 | 2>(1);
  const [scheduleCandidateId, setScheduleCandidateId] = useState<string | null>(null);
  const [shortlistCandidateId, setShortlistCandidateId] = useState<string | null>(null);
  const [shortlistStep, setShortlistStep] = useState<1 | 2>(1);
  const [shortlistRemarks, setShortlistRemarks] = useState("");
  const [finalConfirmId, setFinalConfirmId] = useState<string | null>(null);
  const [isConfirmingFinalDecision, setIsConfirmingFinalDecision] = useState(false);
  const [isConfirmingReject, setIsConfirmingReject] = useState(false);
  const [isShortlisting, setIsShortlisting] = useState(false);
  const [isConfirmingHire, setIsConfirmingHire] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<{
    id: string;
    name: string;
    candidateId: number;
    interviewId: string;
    interviewerEmpId?: string;
    interviewerName?: string;
    roundName?: string;
  } | null>(null);
  const [aiScheduleTarget, setAiScheduleTarget] = useState<{
    id: string;
    name: string;
    candidateId: number;
    currentSlot?: string;
  } | null>(null);
  const [cancelTarget, setCancelTarget] = useState<{ id: string; name: string; interviewId: string } | null>(null);

  const data = propData ?? [];

  const overrideStatus = (id: string, status: ApplicantStatus) => {
    setLocalOverrides((prev) => ({ ...prev, [id]: { ...prev[id], status } }));
  };

  const overrideFinalVerdict = (id: string, verdict: string) => {
    setLocalOverrides((prev) => ({ ...prev, [id]: { ...prev[id], finalVerdict: verdict } }));
  };

  const confirmFinalDecision = async () => {
    if (!finalCandidateId || !finalDecision) return;
    setIsConfirmingFinalDecision(true);
    try {
      const applicant = data.find((a) => a.id === finalCandidateId);
      if (applicant) {
        try {
          const verdict = finalDecision === "selected" ? "SELECTED" as const : finalDecision === "on-hold" ? "ON_HOLD" as const : "REJECTED" as const;
          await updateFinalVerdict(applicant.candidateId, verdict);
          overrideFinalVerdict(finalCandidateId, finalDecision);
        } catch {
          overrideFinalVerdict(finalCandidateId, finalDecision);
        }
      } else {
        overrideFinalVerdict(finalCandidateId, finalDecision);
      }
      setFinalCandidateId(null);
      setFinalDecision(null);
      onRefresh?.();
    } finally {
      setIsConfirmingFinalDecision(false);
    }
  };

  const handleShortlistOk = async () => {
    setIsShortlisting(true);
    try {
      const applicant = data.find((a) => a.id === shortlistCandidateId);
      if (!applicant?.currentRoundId) { setShortlistStep(2); setIsShortlisting(false); return; }
      try {
        await updateReviewByRound(applicant.currentRoundId, {
          entity_type: "hr",
          reviews: { remarks: shortlistRemarks },
          verdict: "shortlisted",
        });
      } catch {
        // API failure shouldn't block the UI flow
      }
      if (shortlistCandidateId) {
        overrideStatus(shortlistCandidateId, "shortlisted");
      }
      setShortlistStep(2);
    } finally {
      setIsShortlisting(false);
    }
  };

  const handleMoveToNextRound = () => {
    if (shortlistCandidateId) {
      setScreeningId(shortlistCandidateId);
      setOpenId(shortlistCandidateId);
    }
    setShortlistCandidateId(null);
  };

  const handleOpenFinalSelectionWarning = () => {
    setFinalConfirmId(shortlistCandidateId);
    setShortlistCandidateId(null);
  };

  const handleFinalConfirmAction = async (decision: "selected" | "rejected" | "on-hold") => {
    setIsConfirmingHire(true);
    try {
      if (finalConfirmId) {
        const applicant = data.find((a) => a.id === finalConfirmId);
        const verdict = decision === "selected" ? "SELECTED" : decision === "rejected" ? "REJECTED" : "ON_HOLD";
        if (applicant) {
          try {
            await updateFinalVerdict(applicant.candidateId, verdict);
            overrideFinalVerdict(finalConfirmId, decision);
          } catch {
            overrideFinalVerdict(finalConfirmId, decision);
          }
        } else {
          overrideFinalVerdict(finalConfirmId, decision);
        }
        setScreeningId(null);
      }
      setFinalConfirmId(null);
      onRefresh?.();
    } finally {
      setIsConfirmingHire(false);
    }
  };

  const confirmRejectFromEvaluation = async (id: string) => {
    setRejectConfirmId(id);
    setRejectStep(1);
    setRejectRemarks("");
  };

  const confirmReject = async () => {
    setIsConfirmingReject(true);
    try {
      const applicant = data.find((a) => a.id === rejectConfirmId);
      if (applicant?.currentRoundId) {
        try {
          await updateReviewByRound(applicant.currentRoundId, {
            entity_type: "hr",
            reviews: { remarks: rejectRemarks },
            verdict: "rejected",
          });
        } catch {
          // API failure shouldn't block the UI flow
        }
      }
      if (rejectConfirmId) {
        overrideStatus(rejectConfirmId, "rejected");
        overrideFinalVerdict(rejectConfirmId, "rejected");
        setScreeningId(null);
      }
      setRejectConfirmId(null);
      setRejectRemarks("");
      setRejectStep(1);
      onRefresh?.();
    } finally {
      setIsConfirmingReject(false);
    }
  };

  const { mutateAsync: moveToScreeningMut } = useMoveToScreening();
  const { mutateAsync: retryScreeningMut } = useAiRetryScreening();
  const { mutateAsync: triggerScreeningMut } = useTriggerScreeningCall();
  const { mutateAsync: updateCandidateRoundStatusMut } = useUpdateCandidateRoundStatus();
  const { mutateAsync: cancelInterviewMut } = useCancelInterview();
  const [retryingScreeningId, setRetryingScreeningId] = useState<string | null>(null);

  const handleRetryAiScreening = useCallback(async (id: string) => {
    const applicant = data.find((a) => a.id === id);
    if (!applicant) return;
    setRetryingScreeningId(id);
    try {
      await retryScreeningMut({ hiringRequestId: jdId, candidateId: applicant.candidateId });
      onRefresh?.();
    } catch {
      // error toast is handled by the hook
    } finally {
      setRetryingScreeningId(null);
    }
  }, [data, jdId, retryScreeningMut, onRefresh]);

  const handleCallNow = useCallback(async (id: string) => {
    const applicant = data.find((a) => a.id === id);
    if (!applicant) return;
    try {
      await triggerScreeningMut({ hiringRequestId: jdId, candidateId: applicant.candidateId });
      onRefresh?.();
    } catch {
      // error toast is handled by the hook
    }
  }, [data, jdId, triggerScreeningMut, onRefresh]);

  const handleCancelInterview = useCallback(async (id: string) => {
    const applicant = data.find((a) => a.id === id);
    if (!applicant) return;
    if (applicant.interviewId) {
      setCancelTarget({ id, name: applicant.name, interviewId: applicant.interviewId });
    } else {
      try {
        await updateCandidateRoundStatusMut({
          candidateId: applicant.candidateId,
          stage: applicant.stage ?? "AI_INTERVIEW",
          status: "INTERVIEW_CANCELLED",
          current_round_id: applicant.currentRoundId ?? "",
        });
        overrideStatus(id, "interview_cancelled");
        useToastStore.getState().addToast("Interview cancelled", ToastType.SUCCESS);
      } catch {
        useToastStore.getState().addToast("Failed to cancel interview", ToastType.ERROR);
      }
    }
  }, [data, updateCandidateRoundStatusMut]);

  const handleCancelConfirm = useCallback(async () => {
    if (!cancelTarget) return;
    try {
      await cancelInterviewMut(cancelTarget.interviewId);
      overrideStatus(cancelTarget.id, "interview_cancelled");
      useToastStore.getState().addToast("Interview cancelled", ToastType.SUCCESS);
      setCancelTarget(null);
      onRefresh?.();
    } catch {
      useToastStore.getState().addToast("Failed to cancel interview", ToastType.ERROR);
    }
  }, [cancelTarget, cancelInterviewMut, onRefresh]);

  const handleRescheduleInterview = useCallback((id: string) => {
    const applicant = data.find((a) => a.id === id);
    if (!applicant) return;
    if (applicant.stage === "AI_INTERVIEW") {
      setAiScheduleTarget({
        id,
        name: applicant.name,
        candidateId: applicant.candidateId,
        currentSlot: applicant.scheduledAt,
      });
      return;
    }
    if (applicant.interviewId) {
      setRescheduleTarget({
        id,
        name: applicant.name,
        candidateId: applicant.candidateId,
        interviewId: applicant.interviewId,
        interviewerEmpId: applicant.interviewerEmpId,
        interviewerName: applicant.interviewerName,
        roundName: applicant.roundName,
      });
    } else {
      useToastStore.getState().addToast("Interview data not available for rescheduling", ToastType.ERROR);
    }
  }, [data]);

  const handleAiScheduled = useCallback(() => {
    setAiScheduleTarget(null);
    onRefresh?.();
  }, [onRefresh]);

  const handleRescheduleScheduled = useCallback(() => {
    setRescheduleTarget(null);
    onRefresh?.();
  }, [onRefresh]);

  const handleMoveToScreening = useCallback(async (id: string) => {
    const applicant = data.find((a) => a.id === id);
    if (!applicant) return;
    try {
      const payload = {
        name: applicant.name,
        email: applicant.email ?? "",
        phone: applicant.phone,
        resume_url: applicant.cvUrl,
      };
      await moveToScreeningMut({
        hiringRequestId: jdId,
        candidateId: applicant.candidateId,
        ...payload,
      });
      useToastStore.getState().addToast("Screening call triggered", ToastType.SUCCESS);
      overrideStatus(id, "under_evaluation");
    } catch {
      useToastStore.getState().addToast("Failed to trigger screening", ToastType.ERROR);
    }
  }, [data, jdId, moveToScreeningMut]);

  const closeFinalDecision = () => {
    setFinalCandidateId(null);
    setFinalDecision(null);
  };

  const closeShortlist = () => setShortlistCandidateId(null);

  const getLocalApplicant = (a: Applicant): Applicant => ({
    ...a,
    status: localOverrides[a.id]?.status ?? a.status,
    finalVerdict: localOverrides[a.id]?.finalVerdict ?? a.finalVerdict,
  });

  const {
    handleAction,
    handleMenuAction,
  } = useApplicantActions({
    onShortlist: (id) => { setShortlistCandidateId(id); setShortlistStep(1); setShortlistRemarks(""); },
    onRejectFromEvaluation: confirmRejectFromEvaluation,
    onMoveToNextRound: (id) => { setShortlistCandidateId(id); setShortlistStep(1); setShortlistRemarks(""); },
    onScheduleInterview: (id) => { setScheduleCandidateId(id); },
    onMoveToScreening: handleMoveToScreening,
    onCancelInterview: handleCancelInterview,
    onRescheduleInterview: handleRescheduleInterview,
    onRetryAiScreening: handleRetryAiScreening,
    onCallNow: handleCallNow,
    onMenuSelect: (id) => { setFinalCandidateId(id); setFinalDecision("selected"); },
    onMenuReject: (id) => { setFinalCandidateId(id); setFinalDecision("rejected"); },
    onMenuHold: (id) => { setFinalCandidateId(id); setFinalDecision("on-hold"); },
  });

  return (
    <>
      <div className="accordion-list">
      {showBulkSelection && (
        <div className="bulk-select-header">
          <i
            className={`bx ${allSelected ? "bx-checkbox-checked" : "bx-checkbox"} applicant-checkbox`}
            onClick={onToggleSelectAll}
          />
          <span className="bulk-select-label">Select All</span>
          {selectionCount > 0 && (
            <span className="bulk-select-count">{selectionCount} candidate{selectionCount !== 1 ? "s" : ""} selected</span>
          )}
        </div>
      )}
      {data.map((a) => {
        const isOpen = openId === a.id;
        const isScreening = screeningId === a.id;
        const merged = getLocalApplicant(a);
        return (
          <div key={a.id} data-applicant-id={a.id} data-highlight={applicantParam === a.id ? "true" : undefined}>
            {merged.stage === "AI_SCREENING" && merged.status?.toLowerCase() !== "ai_screening_evaluation_failed" && merged.status?.toLowerCase() !== "ai_screening_flagged" && (
              <div className="ai-retry-row">
                <button
                  className="action-link action-link-btn"
                  onClick={(e) => { e.stopPropagation(); handleRetryAiScreening(a.id); }}
                  disabled={retryingScreeningId === a.id}
                >
                  {retryingScreeningId === a.id ? "Re-running AI screening..." : "Re-run AI screening"}
                </button>
              </div>
            )}
            <ApplicantCard
              applicant={merged}
              isOpen={isOpen}
              isScreening={isScreening}
              showCheckbox={showBulkSelection}
              isSelected={selectedIds?.has(a.id)}
               onToggleSelect={onToggleSelect}
              accordionTab={accordionTab}
              onToggleOpen={(id) => {
                if (isOpen) { setOpenId(null); } else { setOpenId(id); setAccordionTab("details"); }
              }}
              onAction={handleAction}
              onMenuAction={handleMenuAction}
              onTabChange={setAccordionTab}
              onCoverLetterReadMore={setCoverLetterId}
              onAiSummaryReadMore={setAiSummaryId}
              onDetailsReadMore={setDetailsId}
               onTimeline={onTimeline}
               jdId={jdId}
               isRemote={isRemote}
            />
          </div>
        );
      })}

      <ApplicantActionModals
        data={data}
        finalCandidateId={finalCandidateId}
        finalDecision={finalDecision}
        onCloseFinalDecision={closeFinalDecision}
        confirmFinalDecision={confirmFinalDecision}
        rejectConfirmId={rejectConfirmId}
        rejectRemarks={rejectRemarks}
        rejectStep={rejectStep}
        onRejectRemarksChange={setRejectRemarks}
        onRejectNextStep={() => setRejectStep(2)}
        onCloseReject={() => { setRejectConfirmId(null); setRejectRemarks(""); setRejectStep(1); }}
        onConfirmReject={confirmReject}
        shortlistCandidateId={shortlistCandidateId}
        shortlistStep={shortlistStep}
        shortlistRemarks={shortlistRemarks}
        onShortlistRemarksChange={setShortlistRemarks}
        onShortlistOk={handleShortlistOk}
        onMoveToNextRound={handleMoveToNextRound}
        onOpenFinalSelectionWarning={handleOpenFinalSelectionWarning}
        onCloseShortlist={closeShortlist}
        finalConfirmId={finalConfirmId}
        onFinalConfirmAction={handleFinalConfirmAction}
        onCloseFinalConfirm={() => setFinalConfirmId(null)}
        isConfirmingFinalDecision={isConfirmingFinalDecision}
        isConfirmingReject={isConfirmingReject}
        isShortlisting={isShortlisting}
        isConfirmingHire={isConfirmingHire}
      />

      <ScheduleRoundModal open={!!scheduleCandidateId} candidateName={data.find((a) => a.id === scheduleCandidateId)?.name ?? ""} candidateId={scheduleCandidateId ?? ""} candidateNumberId={data.find((a) => a.id === scheduleCandidateId)?.candidateId ?? 0} jdId={jdId} hiringRequestId={jdId} onClose={() => setScheduleCandidateId(null)} onScheduled={(id) => { overrideStatus(id, "scheduled"); setScreeningId(null); onRefresh?.(); }} />

      <ScheduleRoundModal
        open={!!rescheduleTarget}
        rescheduleMode
        candidateName={rescheduleTarget?.name ?? ""}
        candidateId={rescheduleTarget?.id ?? ""}
        interviewId={rescheduleTarget?.interviewId}
        interviewerEmpId={rescheduleTarget?.interviewerEmpId}
        interviewerName={rescheduleTarget?.interviewerName}
        roundName={rescheduleTarget?.roundName}
        jdId={jdId}
        hiringRequestId={jdId}
        onClose={() => setRescheduleTarget(null)}
        onScheduled={handleRescheduleScheduled}
      />

      <AiInterviewScheduleModal
        key={aiScheduleTarget?.id ?? "ai-schedule-closed"}
        open={!!aiScheduleTarget}
        candidateName={aiScheduleTarget?.name ?? ""}
        candidateId={aiScheduleTarget?.candidateId ?? 0}
        hiringRequestId={jdId}
        currentSlot={aiScheduleTarget?.currentSlot}
        onClose={() => setAiScheduleTarget(null)}
        onScheduled={handleAiScheduled}
      />

      <CancelInterviewModal
        open={!!cancelTarget}
        interviewId={cancelTarget?.interviewId ?? ""}
        candidateName={cancelTarget?.name ?? ""}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancelConfirm}
      />

      {data.map((a) => (<CoverLetterModal key={`cl-${a.id}`} open={coverLetterId === a.id} applicantName={a.name} coverLetter={a.coverLetter ?? ""} onClose={() => setCoverLetterId(null)} />))}
      {data.map((a) => (<AiSummaryModal key={`ai-${a.id}`} open={aiSummaryId === a.id} applicantName={a.name} aiSummary={a.aiSummary ?? ""} onClose={() => setAiSummaryId(null)} />))}

      {data.map((a) => (<ApplicantDetailsModal
          key={`det-${a.id}`}
          open={detailsId === a.id}
          applicantName={a.name}
          details={{ currentCtc: a.currentCtc, expectedCtc: a.expectedCtc, location: a.location, yearsOfExperience: a.yearsOfExperience, noticePeriod: a.noticePeriod, howDidYouHear: a.howDidYouHear, willingToRelocate: a.willingToRelocate === true ? "Yes" : a.willingToRelocate === false ? "No" : undefined }}
          onClose={() => setDetailsId(null)}
          isRemote={isRemote}
        />))}
    </div>
    </>
  );
}

export default Applicants;
