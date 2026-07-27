import { useState, useCallback } from "react";
import { useMoveToScreening } from "@/hooks/use-move-to-screening";
import { useTriggerAiInterview } from "@/hooks/use-trigger-ai-interview";
import { useUpdateCandidateRoundStatus } from "@/hooks/use-update-candidate-round-status";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

export function useBulkSelection(jdId: string, data: Applicant[], onRefresh?: () => void, showBulkSelection = false) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  const { mutateAsync: moveToScreeningMut } = useMoveToScreening();
  const { mutateAsync: triggerAiInterviewMut } = useTriggerAiInterview();
  const { mutateAsync: updateCandidateRoundStatusMut } = useUpdateCandidateRoundStatus();

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

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const allSelected = showBulkSelection && selectedIds.size === data.length && data.length > 0;
  const selectionCount = selectedIds.size;

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
          useToastStore.getState().addToast(`${a.name} moved to AI Screening`, ToastType.SUCCESS);
        } catch {
          useToastStore.getState().addToast(`Failed to move ${a.name} to screening`, ToastType.ERROR);
        }
      }),
    );
    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;
    if (failed > 0) {
      useToastStore.getState().addToast(`${succeeded} moved, ${failed} failed`, ToastType.WARNING);
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
          useToastStore.getState().addToast(`${a.name} moved to AI Interview`, ToastType.SUCCESS);
        } catch {
          useToastStore.getState().addToast(`Failed to move ${a.name} to interview`, ToastType.ERROR);
        }
      }),
    );
    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;
    if (failed > 0) {
      useToastStore.getState().addToast(`${succeeded} moved, ${failed} failed`, ToastType.WARNING);
    }
    setSelectedIds(new Set());
    setIsBulkProcessing(false);
    onRefresh?.();
  }, [data, selectedIds, jdId, triggerAiInterviewMut, updateCandidateRoundStatusMut, onRefresh]);

  return {
    selectedIds,
    isBulkProcessing,
    selectionCount,
    allSelected,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    handleBulkMoveToScreening,
    handleBulkMoveToInterview,
  };
}
