import { useCallback } from "react";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";
import { askSlotsForEmployee } from "../../services/ask-slots.service";
import type { CommandItem } from "../../types";

type AskSlotsButtonProps = {
  item: CommandItem;
  onAskSlotsHover: (e: React.MouseEvent<HTMLButtonElement>, item: CommandItem) => void;
  onAskSlotsLeave: () => void;
};

const AskSlotsButton = ({ item, onAskSlotsHover, onAskSlotsLeave }: AskSlotsButtonProps) => {
  if (item.meta?.type !== "interviewer") return null;
  if (item.meta?.has_slots === "true") return null;

  const handleClick = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const empId = item.relationalId ?? item.id;
    try {
      const data = await askSlotsForEmployee(empId);
      const result = data.results?.[0];
      if (result?.status === "SUCCESS") {
        useToastStore.getState().addToast(data.message, ToastType.SUCCESS);
      } else {
        useToastStore.getState().addToast(result?.message ?? "Failed to request slots", ToastType.ERROR);
      }
    } catch {
      useToastStore.getState().addToast("Failed to request slots. Please try again.", ToastType.ERROR);
    }
  }, [item]);

  return (
    <button
      className="mp-item-ask-slots"
      onMouseEnter={(e) => onAskSlotsHover(e, item)}
      onMouseLeave={onAskSlotsLeave}
      onClick={handleClick}
      type="button"
    >
      <i className="bx bx-calendar-plus" />
    </button>
  );
};

export default AskSlotsButton;
