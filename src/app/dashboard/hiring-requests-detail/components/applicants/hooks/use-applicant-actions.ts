import { useCallback } from "react";
import type { MenuAction } from "../applicants.types";

export type ActionHandlers = {
  onShortlist: (id: string) => void;
  onRejectFromEvaluation: (id: string) => void;
  onMoveToNextRound: (id: string) => void;
  onScheduleInterview: (id: string) => void;
  onMoveToScreening: (id: string) => void;
  onCancelInterview: (id: string) => void;
  onMenuSelect: (id: string) => void;
  onMenuReject: (id: string) => void;
};

export function useApplicantActions(handlers: ActionHandlers) {
  const handleAction = useCallback(
    (handlerKey: string, id: string) => {
      const map: Record<string, (id: string) => void> = {
        onShortlist: handlers.onShortlist,
        onRejectFromEvaluation: handlers.onRejectFromEvaluation,
        onMoveToNextRound: handlers.onMoveToNextRound,
        onScheduleInterview: handlers.onScheduleInterview,
        onMoveToScreening: handlers.onMoveToScreening,
        onCancelInterview: handlers.onCancelInterview,
      };
      map[handlerKey]?.(id);
    },
    [handlers],
  );

  const handleMenuAction = useCallback(
    (action: MenuAction, id: string) => {
      if (action === "select") handlers.onMenuSelect(id);
      if (action === "reject") handlers.onMenuReject(id);
    },
    [handlers],
  );

  return { handleAction, handleMenuAction };
}
