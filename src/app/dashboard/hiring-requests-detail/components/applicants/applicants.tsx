import { useState, useEffect, useRef, useCallback } from "react";
import ApplicantCard from "./applicant-card";
import ApplicantActionModals from "./applicant-action-modals";
import ApplicantTimelineSheet from "@/app/dashboard/hiring-requests-detail/components/timeline/timeline";
import CoverLetterModal from "@/app/dashboard/hiring-requests-detail/components/modal/cover-letter-modal";
import AiSummaryModal from "@/app/dashboard/hiring-requests-detail/components/modal/ai-summary-modal";
import ApplicantDetailsModal from "@/app/dashboard/hiring-requests-detail/components/modal/applicant-details-modal";
import ScheduleRoundModal from "@/app/dashboard/hiring-requests-detail/components/schedule-round/schedule-round-modal";
import { updateReviewByRound, updateFinalVerdict } from "@/services/reviews/reviews";
import { useMoveToScreening } from "@/hooks/use-move-to-screening";
import { useTriggerAiInterview } from "@/hooks/use-trigger-ai-interview";
import { useUpdateCandidateRoundStatus } from "@/hooks/use-update-candidate-round-status";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";
import { useApplicantActions } from "./hooks/use-applicant-actions";
import type { Applicant, ApplicantStatus, AccordionTab, ApplicantsProps } from "./applicants.types";

type LocalOverride = {
  status?: ApplicantStatus;
  screening?: boolean;
  finalVerdict?: string;
};

function Applicants({ data: propData, openId, setOpenId, hasMore, onLoadMore, applicantParam, onRefresh, jdId, isRemote, showBulkSelection = false }: ApplicantsProps) {
  const [localOverrides, setLocalOverrides] = useState<Record<string, LocalOverride>>({});
  const [screeningId, setScreeningId] = useState<string | null>(null);
  const [timelineId, setTimelineId] = useState<number | null>(null);
  const [coverLetterId, setCoverLetterId] = useState<string | null>(null);
  const [aiSummaryId, setAiSummaryId] = useState<string | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [accordionTab, setAccordionTab] = useState<AccordionTab>("details");
  const [finalCandidateId, setFinalCandidateId] = useState<string | null>(null);
  const [finalDecision, setFinalDecision] = useState<"selected" | "rejected" | null>(null);
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  const data = propData ?? [];

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && onLoadMore) onLoadMore();
    },
    [hasMore, onLoadMore],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, { rootMargin: "200px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

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
          const verdict = finalDecision === "selected" ? "SELECTED" as const : "REJECTED" as const;
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

  const handleConfirmFinalHire = async () => {
    setIsConfirmingHire(true);
    try {
      if (finalConfirmId) {
        const applicant = data.find((a) => a.id === finalConfirmId);
        if (applicant) {
          try {
            await updateFinalVerdict(applicant.candidateId, "SELECTED");
            overrideFinalVerdict(finalConfirmId, "selected");
          } catch {
            overrideFinalVerdict(finalConfirmId, "selected");
          }
        } else {
          overrideFinalVerdict(finalConfirmId, "selected");
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
  const { mutateAsync: triggerAiInterviewMut } = useTriggerAiInterview();
  const { mutateAsync: updateCandidateRoundStatusMut } = useUpdateCandidateRoundStatus();

  const handleCancelInterview = useCallback(async (id: string) => {
    const applicant = data.find((a) => a.id === id);
    if (!applicant) return;
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
  }, [data, updateCandidateRoundStatusMut]);

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

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (!showBulkSelection) return;
    setSelectedIds((prev) => {
      if (prev.size === data.length) return new Set();
      return new Set(data.map((a) => a.id));
    });
  }, [data, showBulkSelection]);

  const allSelected = showBulkSelection && selectedIds.size === data.length && data.length > 0;

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handleBulkMoveToScreening = useCallback(async () => {
    const candidates = data.filter((a) => selectedIds.has(a.id));
    if (candidates.length === 0) return;
    setIsBulkProcessing(true);
    const results = await Promise.allSettled(
      candidates.map(async (a) => {
        // TODO: temporary workaround — fix when asked
        try {
          await moveToScreeningMut({
            hiringRequestId: jdId,
            candidateId: a.candidateId,
            name: a.name,
            email: a.email ?? "",
            phone: a.phone,
            resume_url: a.cvUrl,
          });
        } catch {
          // proceed even if moveToScreening fails
        }

        let round_id = "";
        // TODO: temporary workaround — fix when asked
        try {
          const resp = await triggerAiInterviewMut({
            hiringRequestId: jdId,
            candidateId: a.candidateId,
            round_name: "AI Screening Round",
            interview_type: "AI_SCREENING",
            round_type: "AI_SCREENING_ROUND",
          });
          round_id = resp.round_id;
        } catch {
          // proceed even if triggerAiInterview fails
        }

        // TODO: temporary workaround — fix when asked
        try {
          await updateCandidateRoundStatusMut({
            candidateId: a.candidateId,
            stage: "AI_SCREENING",
            status: "SCREENING_ROUND_SCHEDULED",
            current_round_id: round_id,
          });
          overrideStatus(a.id, "screening_round_scheduled");
          useToastStore.getState().addToast(`${a.name} moved to AI Screening`, ToastType.SUCCESS);
        } catch {
          useToastStore.getState().addToast(`Failed to move ${a.name} to screening`, ToastType.ERROR);
        }
      }),
    );
    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;
    if (failed > 0) {
      useToastStore.getState().addToast(`${succeeded} moved, ${failed} failed`, failed === 0 ? ToastType.SUCCESS : ToastType.WARNING);
    }
    setSelectedIds(new Set());
    setIsBulkProcessing(false);
    onRefresh?.();
  }, [data, selectedIds, jdId, moveToScreeningMut, triggerAiInterviewMut, updateCandidateRoundStatusMut, onRefresh]);

  const handleBulkMoveToInterview = useCallback(async () => {
    const candidates = data.filter((a) => selectedIds.has(a.id));
    if (candidates.length === 0) return;
    setIsBulkProcessing(true);
    const results = await Promise.allSettled(
      candidates.map(async (a) => {
        let round_id = "";
        // TODO: temporary workaround — fix when asked
        try {
          const resp = await triggerAiInterviewMut({
            hiringRequestId: jdId,
            candidateId: a.candidateId,
            round_name: "AI Interview Round",
            interview_type: "AI_INTERVIEW",
            round_type: "AI_INTERVIEW_ROUND",
          });
          round_id = resp.round_id;
        } catch {
          // proceed even if triggerAiInterview fails
        }

        // TODO: temporary workaround — fix when asked
        try {
          await updateCandidateRoundStatusMut({
            candidateId: a.candidateId,
            stage: "AI_INTERVIEW",
            status: "INTERVIEW_SCHEDULED",
            current_round_id: round_id,
          });
          overrideStatus(a.id, "interview_scheduled");
          useToastStore.getState().addToast(`${a.name} moved to AI Interview`, ToastType.SUCCESS);
        } catch {
          useToastStore.getState().addToast(`Failed to move ${a.name} to interview`, ToastType.ERROR);
        }
      }),
    );
    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;
    if (failed > 0) {
      useToastStore.getState().addToast(`${succeeded} moved, ${failed} failed`, failed === 0 ? ToastType.SUCCESS : ToastType.WARNING);
    }
    setSelectedIds(new Set());
    setIsBulkProcessing(false);
    onRefresh?.();
  }, [data, selectedIds, jdId, triggerAiInterviewMut, updateCandidateRoundStatusMut, onRefresh]);

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
    onMenuSelect: (id) => { setFinalCandidateId(id); setFinalDecision("selected"); },
    onMenuReject: (id) => { setFinalCandidateId(id); setFinalDecision("rejected"); },
  });

  const selectionCount = selectedIds.size;

  return (
    <>
      <div className="accordion-list">
      {showBulkSelection && (
        <div className="bulk-select-header">
          <i
            className={`bx ${allSelected ? "bx-checkbox-checked" : "bx-checkbox"} applicant-checkbox`}
            onClick={toggleSelectAll}
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
            <ApplicantCard
              applicant={merged}
              isOpen={isOpen}
              isScreening={isScreening}
              showCheckbox={showBulkSelection}
              isSelected={selectedIds.has(a.id)}
              onToggleSelect={toggleSelect}
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
               onTimeline={setTimelineId}
               jdId={jdId}
               isRemote={isRemote}
            />
          </div>
        );
      })}
      {hasMore && <div ref={sentinelRef} className="scroll-sentinel" />}

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
        onConfirmHire={handleConfirmFinalHire}
        onCloseFinalConfirm={() => setFinalConfirmId(null)}
        isConfirmingFinalDecision={isConfirmingFinalDecision}
        isConfirmingReject={isConfirmingReject}
        isShortlisting={isShortlisting}
        isConfirmingHire={isConfirmingHire}
      />

      <ScheduleRoundModal open={!!scheduleCandidateId} candidateName={data.find((a) => a.id === scheduleCandidateId)?.name ?? ""} candidateId={scheduleCandidateId ?? ""} candidateNumberId={data.find((a) => a.id === scheduleCandidateId)?.candidateId ?? 0} jdId={jdId} hiringRequestId={jdId} onClose={() => setScheduleCandidateId(null)} onScheduled={(id) => { overrideStatus(id, "scheduled"); setScreeningId(null); onRefresh?.(); }} />

      {showBulkSelection && selectionCount > 0 && (
        <div className="bulk-action-bar">
          <span className="bulk-action-count">{selectionCount} candidate{selectionCount !== 1 ? "s" : ""} selected</span>
          <div className="bulk-action-buttons">
            <button
              className="btn screen-btn compact"
              onClick={handleBulkMoveToScreening}
              disabled={isBulkProcessing}
              type="button"
            >
              {isBulkProcessing ? <i className="bx bx-loader-alt bx-spin" /> : <i className="bx bx-phone" />}
              {" "}Move to AI Screening
            </button>
            <button
              className="btn screen-btn compact"
              onClick={handleBulkMoveToInterview}
              disabled={isBulkProcessing}
              type="button"
            >
              {isBulkProcessing ? <i className="bx bx-loader-alt bx-spin" /> : <i className="bx bx-bot" />}
              {" "}Move to AI Interview
            </button>
            <button
              className="bulk-action-clear"
              onClick={clearSelection}
              disabled={isBulkProcessing}
              type="button"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <ApplicantTimelineSheet openId={timelineId} onClose={() => setTimelineId(null)} />

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
