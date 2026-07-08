import type { CommandItem } from "../../types";

type AskSlotsButtonProps = {
  item: CommandItem;
  onAskSlotsHover: (e: React.MouseEvent<HTMLButtonElement>, item: CommandItem) => void;
  onAskSlotsLeave: () => void;
};

const AskSlotsButton = ({ item, onAskSlotsHover, onAskSlotsLeave }: AskSlotsButtonProps) => {
  if (item.meta?.type !== "interviewer") return null;
  return (
    <button
      className="mp-item-ask-slots"
      onMouseEnter={(e) => onAskSlotsHover(e, item)}
      onMouseLeave={onAskSlotsLeave}
      onClick={(e) => e.stopPropagation()}
      type="button"
    >
      <i className="bx bx-calendar-plus" />
    </button>
  );
};

export default AskSlotsButton;
