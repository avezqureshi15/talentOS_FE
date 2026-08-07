import { useCallback, useState } from "react";
import { askSlotsForEmployee } from "@/components/shared/mentions/services/ask-slots.service";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";
import { SR_LABELS } from "./schedule-round-modal.constants";

export function useAskSlots() {
  // justification: tracks the in-flight state of the slot request
  const [isAsking, setIsAsking] = useState(false);

  const askSlots = useCallback(async (empId: string, onRequested?: () => void) => {
    setIsAsking(true);
    try {
      const data = await askSlotsForEmployee(empId);
      const result = data.results?.[0];
      if (result?.status === "SUCCESS") {
        useToastStore.getState().addToast(data.message, ToastType.SUCCESS);
        onRequested?.();
      } else {
        useToastStore.getState().addToast(result?.message ?? SR_LABELS.ASK_SLOTS_FAILED, ToastType.ERROR);
      }
    } catch {
      useToastStore.getState().addToast(SR_LABELS.ASK_SLOTS_ERROR, ToastType.ERROR);
    } finally {
      setIsAsking(false);
    }
  }, []);

  return { isAsking, askSlots };
}
