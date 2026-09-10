import { useAskSlots } from "./use-ask-slots";
import { SR_LABELS } from "./schedule-round-modal.constants";
import "./sr-ask-slots-button.css";
import type { SrAskSlotsButtonProps } from "./sr-ask-slots-button.types";

const SrAskSlotsButton = ({ empId, onRequested }: SrAskSlotsButtonProps) => {
  const { isAsking, askSlots } = useAskSlots();

  return (
    <button
      className="sr-ask-slots-btn"
      onClick={() => askSlots(empId, onRequested)}
      disabled={isAsking}
      type="button"
    >
      {isAsking ? <i className="bx bx-loader-alt bx-spin" /> : <i className="bx bx-calendar-plus" />}
      {SR_LABELS.ASK_SLOTS_BTN}
    </button>
  );
};

export default SrAskSlotsButton;
