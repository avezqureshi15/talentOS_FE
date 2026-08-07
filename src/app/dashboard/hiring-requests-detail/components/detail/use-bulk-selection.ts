import { useState, useCallback } from "react";
import { useMoveToScreening } from "@/hooks/use-move-to-screening";
import { useMoveToInterview } from "@/hooks/use-move-to-interview";
import { updateReviewByRound } from "@/services/reviews/reviews";
import { updateCandidateArchive } from "@/services/applications/applications";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

export type BulkAction = "screening" | "interview" | "archive";

export function useBulkSelection(jdId: string, data: Applicant[], onRefresh?: () => void, showBulkSelection = false) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [activeAction, setActiveAction] = useState<BulkAction | null>(null);

  const { mutateAsync: moveToScreeningMut } = useMoveToScreening();
  const { mutateAsync: moveToInterviewMut } = useMoveToInterview();

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
  const hasCandidatesWithRound = data.some((a) => selectedIds.has(a.id) && a.currentRoundId);

  const submitRemarks = useCallback(async (remarks: string) => {
    if (!remarks) return;
    const candidates = data.filter((a) => selectedIds.has(a.id) && a.currentRoundId);
    if (candidates.length === 0) return;
    await Promise.allSettled(
      candidates.map(async (a) => {
        try {
          await updateReviewByRound(a.currentRoundId!, {
            entity_type: "hr",
            reviews: { remarks },
            verdict: "shortlisted",
          });
        } catch {
          // TODO: temporary workaround — fix when asked
        }
      }),
    );
  }, [data, selectedIds]);

  const handleBulkMoveToScreening = useCallback(async (remarks?: string) => {
    const candidates = data.filter((a) => selectedIds.has(a.id));
    if (candidates.length === 0) return;
    setIsBulkProcessing(true);
    setActiveAction("screening");
    try {
      if (remarks) await submitRemarks(remarks);
      const results = await Promise.allSettled(
        candidates.map(async (a) => {
          try {
            await moveToScreeningMut({
              hiringRequestId: jdId,
              candidateId: a.candidateId,
              name: a.name,
              email: a.email ?? "",
              phone: a.phone,
              resume_url: a.cvUrl,
              round_name: "AI Screening Round",
              round_type: "AI_SCREENING_ROUND",
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
      onRefresh?.();
    } finally {
      setActiveAction(null);
      setIsBulkProcessing(false);
    }
  }, [data, selectedIds, jdId, moveToScreeningMut, onRefresh, submitRemarks]);

  const handleBulkMoveToInterview = useCallback(async (remarks?: string) => {
    const candidates = data.filter((a) => selectedIds.has(a.id));
    if (candidates.length === 0) return;
    setIsBulkProcessing(true);
    setActiveAction("interview");
    try {
      if (remarks) await submitRemarks(remarks);
      const results = await Promise.allSettled(
        candidates.map(async (a) => {
          try {
            await moveToInterviewMut({
              hiringRequestId: jdId,
              candidateId: a.candidateId,
              round_name: "AI Interview Round",
              interview_type: "AI_INTERVIEW",
              round_type: "AI_INTERVIEW_ROUND",
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
      if (succeeded > 0) {
        useToastStore.getState().addToast(
          "Moved to AI Interview — set or reschedule each candidate's slot anytime via the Reschedule action",
          ToastType.INFO,
          5000,
        );
      }
      setSelectedIds(new Set());
      onRefresh?.();
    } finally {
      setActiveAction(null);
      setIsBulkProcessing(false);
    }
  }, [data, selectedIds, jdId, moveToInterviewMut, onRefresh, submitRemarks]);

  const handleBulkArchive = useCallback(async (archived: boolean) => {
    const candidates = data.filter((a) => selectedIds.has(a.id));
    if (candidates.length === 0) return;
    setIsBulkProcessing(true);
    setActiveAction("archive");
    const verb = archived ? "archived" : "restored";
    try {
      const results = await Promise.allSettled(
        candidates.map(async (a) => {
          try {
            await updateCandidateArchive(a.candidateId, { archived });
            useToastStore.getState().addToast(`${a.name} ${verb}`, ToastType.SUCCESS);
          } catch {
            useToastStore.getState().addToast(`Failed to ${verb} ${a.name}`, ToastType.ERROR);
          }
        }),
      );
      const succeeded = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;
      if (failed > 0) {
        useToastStore.getState().addToast(`${succeeded} ${verb}, ${failed} failed`, ToastType.WARNING);
      }
      setSelectedIds(new Set());
      onRefresh?.();
    } finally {
      setActiveAction(null);
      setIsBulkProcessing(false);
    }
  }, [data, selectedIds, onRefresh]);

  return {
    selectedIds,
    isBulkProcessing,
    activeAction,
    selectionCount,
    allSelected,
    hasCandidatesWithRound,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    handleBulkMoveToScreening,
    handleBulkMoveToInterview,
    handleBulkArchive,
  };
}
