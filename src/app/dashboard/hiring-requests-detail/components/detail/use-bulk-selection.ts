import { useState, useCallback } from "react";
import { useMoveToScreening } from "@/hooks/use-move-to-screening";
import { useMoveToInterview } from "@/hooks/use-move-to-interview";
import { updateReviewByRound } from "@/services/reviews/reviews";
import { updateCandidateArchive } from "@/services/applications/applications";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";
import { BULK_SELECTION_MAX, BULK_SELECTION_MAX_TOAST, BULK_SELECTION_MAX_TOAST_MS } from "@/constants/api-endpoints";
import { canBulkAdvance } from "./bulk-eligibility";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

export type BulkAction = "screening" | "interview" | "archive";

const emptySet = () => new Set<string>();

export function useBulkSelection(
  jdId: string,
  data: Applicant[],
  onRefresh?: () => void,
  showBulkSelection = false,
  bulkKey = "default",
) {
  const [selections, setSelections] = useState<Record<string, Set<string>>>({});
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [activeAction, setActiveAction] = useState<BulkAction | null>(null);

  const { mutateAsync: moveToScreeningMut } = useMoveToScreening();
  const { mutateAsync: moveToInterviewMut } = useMoveToInterview();

  const selectedIds = selections[bulkKey] ?? emptySet();

  const setCurrentSelection = useCallback(
    (updater: (prev: Set<string>) => Set<string>) => {
      setSelections((prev) => ({
        ...prev,
        [bulkKey]: updater(prev[bulkKey] ?? emptySet()),
      }));
    },
    [bulkKey],
  );

  const toggleSelect = useCallback((id: string) => {
    if (selectedIds.has(id)) {
      setCurrentSelection((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      return;
    }
    if (selectedIds.size >= BULK_SELECTION_MAX) {
      useToastStore.getState().addToast(
        BULK_SELECTION_MAX_TOAST,
        ToastType.INFO,
        BULK_SELECTION_MAX_TOAST_MS,
      );
      return;
    }
    setCurrentSelection((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, [selectedIds, setCurrentSelection]);

  const toggleSelectAll = useCallback(() => {
    if (!showBulkSelection) return;
    const eligible = data.filter(canBulkAdvance);
    if (eligible.length === 0) {
      setCurrentSelection(() => emptySet());
      return;
    }
    const capped = eligible.slice(0, BULK_SELECTION_MAX);
    const cappedSelected =
      capped.length > 0 &&
      capped.every((a) => selectedIds.has(a.id)) &&
      selectedIds.size === capped.length;
    const allEligibleSelected = eligible.every((a) => selectedIds.has(a.id));
    if (allEligibleSelected || cappedSelected) {
      setCurrentSelection(() => emptySet());
      return;
    }
    if (eligible.length > BULK_SELECTION_MAX) {
      useToastStore.getState().addToast(
        BULK_SELECTION_MAX_TOAST,
        ToastType.INFO,
        BULK_SELECTION_MAX_TOAST_MS,
      );
    }
    setCurrentSelection(() => new Set(capped.map((a) => a.id)));
  }, [data, showBulkSelection, selectedIds, setCurrentSelection]);

  const clearSelection = useCallback(() => {
    setCurrentSelection(() => emptySet());
  }, [setCurrentSelection]);

  const eligibleIds = data.filter(canBulkAdvance).map((a) => a.id);
  const selectableCount = Math.min(eligibleIds.length, BULK_SELECTION_MAX);
  const allSelected =
    showBulkSelection &&
    selectableCount > 0 &&
    eligibleIds.filter((id) => selectedIds.has(id)).length >= selectableCount;
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
      clearSelection();
      onRefresh?.();
    } finally {
      setActiveAction(null);
      setIsBulkProcessing(false);
    }
  }, [data, selectedIds, jdId, moveToScreeningMut, onRefresh, submitRemarks, clearSelection]);

  const handleBulkMoveToInterview = useCallback(async (remarks?: string) => {
    const selected = data.filter((a) => selectedIds.has(a.id));
    const candidates = selected.filter(canBulkAdvance);
    const skipped = selected.length - candidates.length;
    if (candidates.length === 0) {
      if (skipped > 0) {
        useToastStore.getState().addToast(
          `${skipped} candidate${skipped !== 1 ? "s" : ""} skipped — already scheduled or decided`,
          ToastType.WARNING,
        );
      }
      return;
    }
    setIsBulkProcessing(true);
    setActiveAction("interview");
    try {
      if (skipped > 0) {
        useToastStore.getState().addToast(
          `${skipped} candidate${skipped !== 1 ? "s" : ""} skipped — already scheduled or decided`,
          ToastType.INFO,
        );
      }
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
      clearSelection();
      onRefresh?.();
    } finally {
      setActiveAction(null);
      setIsBulkProcessing(false);
    }
  }, [data, selectedIds, jdId, moveToInterviewMut, onRefresh, submitRemarks, clearSelection]);

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
      clearSelection();
      onRefresh?.();
    } finally {
      setActiveAction(null);
      setIsBulkProcessing(false);
    }
  }, [data, selectedIds, onRefresh, clearSelection]);

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
