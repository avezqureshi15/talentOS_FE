import { useState, useCallback } from "react";
import { useMoveToScreening } from "@/hooks/use-move-to-screening";
import { useAiRetryScreening, useTriggerScreeningCall } from "@/hooks/use-ai-retry";
import { useUpdateCandidateRoundStatus } from "@/hooks/use-update-candidate-round-status";
import { useCancelInterview } from "@/hooks/use-cancel-interview";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";
import { useApplicantActions } from "./use-applicant-actions";
import { updateReviewByRound, updateFinalVerdict } from "@/services/reviews/reviews";
import type { Applicant, ApplicantStatus, ApplicantActionModalsProps, MenuAction } from "../applicants.types";

type LocalOverride = { status?: ApplicantStatus; finalVerdict?: string };

type RescheduleTarget = {
  id: string;
  name: string;
  candidateId: number;
  interviewId: string;
  interviewerEmpId?: string;
  interviewerName?: string;
  roundName?: string;
};

type AiScheduleTarget = {
  id: string;
  name: string;
  candidateId: number;
  currentSlot?: string;
};

type CancelTarget = { id: string; name: string; interviewId: string };

export type UseApplicantActionHandlersReturn = {
  modalProps: ApplicantActionModalsProps;
  scheduleProps: {
    candidateId: string | null;
    candidateName: string;
    candidateNumberId: number;
    onClose: () => void;
    onScheduled: (id: string) => void;
  };
  rescheduleProps: {
    target: RescheduleTarget | null;
    onClose: () => void;
    onScheduled: () => void;
  };
  aiScheduleProps: {
    target: AiScheduleTarget | null;
    onClose: () => void;
    onScheduled: () => void;
  };
  cancelProps: {
    target: CancelTarget | null;
    onClose: () => void;
    onConfirm: () => void;
  };
  handleAction: (handlerKey: string, id: string) => void;
  handleMenuAction: (action: MenuAction, id: string) => void;
  getLocalApplicant: (a: Applicant) => Applicant;
  retryingScreeningId: string | null;
};

export function useApplicantActionHandlers({
  data,
  jdId,
  onRefresh,
  onMoveToNextRoundSideEffect,
}: {
  data: Applicant[];
  jdId: string;
  onRefresh?: () => void;
  onMoveToNextRoundSideEffect?: (id: string) => void;
}): UseApplicantActionHandlersReturn {
  const [localOverrides, setLocalOverrides] = useState<Record<string, LocalOverride>>({});
  const [shortlistCandidateId, setShortlistCandidateId] = useState<string | null>(null);
  const [shortlistStep, setShortlistStep] = useState<1 | 2>(1);
  const [shortlistRemarks, setShortlistRemarks] = useState("");
  const [rejectConfirmId, setRejectConfirmId] = useState<string | null>(null);
  const [rejectRemarks, setRejectRemarks] = useState("");
  const [rejectStep, setRejectStep] = useState<1 | 2>(1);
  const [finalCandidateId, setFinalCandidateId] = useState<string | null>(null);
  const [finalDecision, setFinalDecision] = useState<"selected" | "on-hold" | "rejected" | null>(null);
  const [scheduleCandidateId, setScheduleCandidateId] = useState<string | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<RescheduleTarget | null>(null);
  const [aiScheduleTarget, setAiScheduleTarget] = useState<AiScheduleTarget | null>(null);
  const [cancelTarget, setCancelTarget] = useState<CancelTarget | null>(null);
  const [isConfirmingFinalDecision, setIsConfirmingFinalDecision] = useState(false);
  const [isConfirmingReject, setIsConfirmingReject] = useState(false);
  const [isShortlisting, setIsShortlisting] = useState(false);
  const [isConfirmingHire, setIsConfirmingHire] = useState(false);
  const [finalConfirmId, setFinalConfirmId] = useState<string | null>(null);
  const [retryingScreeningId, setRetryingScreeningId] = useState<string | null>(null);

  const { mutateAsync: moveToScreeningMut } = useMoveToScreening();
  const { mutateAsync: retryScreeningMut } = useAiRetryScreening();
  const { mutateAsync: triggerScreeningMut } = useTriggerScreeningCall();
  const { mutateAsync: updateCandidateRoundStatusMut } = useUpdateCandidateRoundStatus();
  const { mutateAsync: cancelInterviewMut } = useCancelInterview();

  const overrideStatus = (id: string, status: ApplicantStatus) =>
    setLocalOverrides((prev) => ({ ...prev, [id]: { ...prev[id], status } }));

  const overrideFinalVerdict = (id: string, verdict: string) =>
    setLocalOverrides((prev) => ({ ...prev, [id]: { ...prev[id], finalVerdict: verdict } }));

  const getLocalApplicant = (a: Applicant): Applicant => ({
    ...a,
    status: localOverrides[a.id]?.status ?? a.status,
    finalVerdict: localOverrides[a.id]?.finalVerdict ?? a.finalVerdict,
  });

  const confirmFinalDecision = async () => {
    if (!finalCandidateId || !finalDecision) return;
    setIsConfirmingFinalDecision(true);
    try {
      const applicant = data.find((a) => a.id === finalCandidateId);
      const verdict = finalDecision === "selected" ? "SELECTED" as const : finalDecision === "on-hold" ? "ON_HOLD" as const : "REJECTED" as const;
      try {
        if (applicant) await updateFinalVerdict(applicant.candidateId, verdict);
      } catch { /* optimistic fallthrough */ }
      overrideFinalVerdict(finalCandidateId, finalDecision);
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
      if (!applicant?.currentRoundId) { setShortlistStep(2); return; }
      try {
        await updateReviewByRound(applicant.currentRoundId, {
          entity_type: "hr",
          reviews: { remarks: shortlistRemarks },
          verdict: "shortlisted",
        });
      } catch { /* optimistic fallthrough */ }
      if (shortlistCandidateId) overrideStatus(shortlistCandidateId, "shortlisted");
      setShortlistStep(2);
    } finally {
      setIsShortlisting(false);
    }
  };

  // Step 2 of shortlist modal: "Move to Next Round" button
  const handleMoveToNextRound = () => {
    if (shortlistCandidateId) {
      // Optimistically advance to move_to_next_round so the row/card shows "Schedule Round"
      overrideStatus(shortlistCandidateId, "move_to_next_round");
      // Card-view side effect: open the accordion in scheduling mode
      onMoveToNextRoundSideEffect?.(shortlistCandidateId);
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
        try {
          if (applicant) await updateFinalVerdict(applicant.candidateId, verdict);
        } catch { /* optimistic fallthrough */ }
        overrideFinalVerdict(finalConfirmId, decision);
        setScheduleCandidateId(null);
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
        } catch { /* optimistic fallthrough */ }
      }
      if (rejectConfirmId) {
        overrideStatus(rejectConfirmId, "rejected");
        overrideFinalVerdict(rejectConfirmId, "rejected");
      }
      setRejectConfirmId(null);
      setRejectRemarks("");
      setRejectStep(1);
      onRefresh?.();
    } finally {
      setIsConfirmingReject(false);
    }
  };

  const handleRetryAiScreening = useCallback(async (id: string) => {
    const applicant = data.find((a) => a.id === id);
    if (!applicant) return;
    setRetryingScreeningId(id);
    try {
      await retryScreeningMut({ hiringRequestId: jdId, candidateId: applicant.candidateId });
      onRefresh?.();
    } catch { /* error toast handled by hook */ }
    finally { setRetryingScreeningId(null); }
  }, [data, jdId, retryScreeningMut, onRefresh]);

  const handleCallNow = useCallback(async (id: string) => {
    const applicant = data.find((a) => a.id === id);
    if (!applicant) return;
    try {
      await triggerScreeningMut({ hiringRequestId: jdId, candidateId: applicant.candidateId });
      onRefresh?.();
    } catch { /* error toast handled by hook */ }
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
      setAiScheduleTarget({ id, name: applicant.name, candidateId: applicant.candidateId, currentSlot: applicant.scheduledAt });
      return;
    }
    if (applicant.interviewId) {
      setRescheduleTarget({
        id, name: applicant.name, candidateId: applicant.candidateId,
        interviewId: applicant.interviewId,
        interviewerEmpId: applicant.interviewerEmpId,
        interviewerName: applicant.interviewerName,
        roundName: applicant.roundName,
      });
    } else {
      useToastStore.getState().addToast("Interview data not available for rescheduling", ToastType.ERROR);
    }
  }, [data]);

  const handleMoveToScreening = useCallback(async (id: string) => {
    const applicant = data.find((a) => a.id === id);
    if (!applicant) return;
    try {
      await moveToScreeningMut({
        hiringRequestId: jdId,
        candidateId: applicant.candidateId,
        name: applicant.name,
        email: applicant.email ?? "",
        phone: applicant.phone,
        resume_url: applicant.cvUrl,
      });
      useToastStore.getState().addToast("Screening call triggered", ToastType.SUCCESS);
      overrideStatus(id, "under_evaluation");
    } catch {
      useToastStore.getState().addToast("Failed to trigger screening", ToastType.ERROR);
    }
  }, [data, jdId, moveToScreeningMut]);

  const { handleAction, handleMenuAction } = useApplicantActions({
    onShortlist: (id) => { setShortlistCandidateId(id); setShortlistStep(1); setShortlistRemarks(""); },
    onRejectFromEvaluation: confirmRejectFromEvaluation,
    onMoveToNextRound: (id) => { setShortlistCandidateId(id); setShortlistStep(1); setShortlistRemarks(""); },
    onScheduleInterview: (id) => setScheduleCandidateId(id),
    onMoveToScreening: handleMoveToScreening,
    onCancelInterview: handleCancelInterview,
    onRescheduleInterview: handleRescheduleInterview,
    onRetryAiScreening: handleRetryAiScreening,
    onCallNow: handleCallNow,
    onMenuSelect: (id) => { setFinalCandidateId(id); setFinalDecision("selected"); },
    onMenuReject: (id) => { setFinalCandidateId(id); setFinalDecision("rejected"); },
    onMenuHold: (id) => { setFinalCandidateId(id); setFinalDecision("on-hold"); },
  });

  const scheduleCandidate = data.find((a) => a.id === scheduleCandidateId);

  const modalProps: ApplicantActionModalsProps = {
    data,
    finalCandidateId,
    finalDecision,
    onCloseFinalDecision: () => { setFinalCandidateId(null); setFinalDecision(null); },
    confirmFinalDecision,
    rejectConfirmId,
    rejectRemarks,
    rejectStep,
    onRejectRemarksChange: setRejectRemarks,
    onRejectNextStep: () => setRejectStep(2),
    onCloseReject: () => { setRejectConfirmId(null); setRejectRemarks(""); setRejectStep(1); },
    onConfirmReject: confirmReject,
    shortlistCandidateId,
    shortlistStep,
    shortlistRemarks,
    onShortlistRemarksChange: setShortlistRemarks,
    onShortlistOk: handleShortlistOk,
    onMoveToNextRound: handleMoveToNextRound,
    onOpenFinalSelectionWarning: handleOpenFinalSelectionWarning,
    onCloseShortlist: () => setShortlistCandidateId(null),
    finalConfirmId,
    onFinalConfirmAction: handleFinalConfirmAction,
    onCloseFinalConfirm: () => setFinalConfirmId(null),
    isConfirmingFinalDecision,
    isConfirmingReject,
    isShortlisting,
    isConfirmingHire,
  };

  return {
    modalProps,
    scheduleProps: {
      candidateId: scheduleCandidateId,
      candidateName: scheduleCandidate?.name ?? "",
      candidateNumberId: scheduleCandidate?.candidateId ?? 0,
      onClose: () => setScheduleCandidateId(null),
      onScheduled: (id: string) => { overrideStatus(id, "scheduled"); onRefresh?.(); setScheduleCandidateId(null); },
    },
    rescheduleProps: {
      target: rescheduleTarget,
      onClose: () => setRescheduleTarget(null),
      onScheduled: () => { setRescheduleTarget(null); onRefresh?.(); },
    },
    aiScheduleProps: {
      target: aiScheduleTarget,
      onClose: () => setAiScheduleTarget(null),
      onScheduled: () => { setAiScheduleTarget(null); onRefresh?.(); },
    },
    cancelProps: {
      target: cancelTarget,
      onClose: () => setCancelTarget(null),
      onConfirm: handleCancelConfirm,
    },
    handleAction,
    handleMenuAction,
    getLocalApplicant,
    retryingScreeningId,
  };
}
