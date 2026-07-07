import type { CommandItem } from "../../types";

type MultiSelectListProps = {
  listItems: CommandItem[];
  selectedIndex: number;
  setSelectedIndex: (v: number) => void;
  multiSelectedIds: string[];
  onToggleMultiSelect: (id: string) => void;
  onAskSlotsHover: (e: React.MouseEvent<HTMLButtonElement>, item: CommandItem) => void;
  onAskSlotsLeave: () => void;
};

const MAX_SELECTION = 10;

const MultiSelectList = ({
  listItems, selectedIndex, setSelectedIndex,
  multiSelectedIds, onToggleMultiSelect,
  onAskSlotsHover, onAskSlotsLeave,
}: MultiSelectListProps) => {
  const atMax = multiSelectedIds.length >= MAX_SELECTION;
  return (
    <>
      {listItems.map((item, i) => {
        const isSelected = multiSelectedIds.includes(item.id);
        return (
          <div
            key={item.id}
            className={`mp-item${i === selectedIndex ? " mp-item--selected" : ""}${isSelected ? " mp-item--checked" : ""}${atMax && !isSelected ? " mp-item--dimmed" : ""}`}
            onClick={() => { onToggleMultiSelect(item.id); setSelectedIndex(i); }}
            onMouseEnter={() => setSelectedIndex(i)}
          >
            <div className="mp-item-check"><i className={`bx ${isSelected ? "bx-checkbox-checked" : "bx-checkbox"} mp-check-icon`} /></div>
            <div className="mp-item-avatar">{item.label.charAt(0).toUpperCase()}</div>
            <div className="mp-item-content">
              <div className="mp-item-label">{item.label}</div>
              {item.description && <div className="mp-item-desc">{item.description}</div>}
            </div>
            {item.meta?.type === "interviewer" && (
              <button
                className="mp-item-ask-slots"
                onMouseEnter={(e) => onAskSlotsHover(e, item)}
                onMouseLeave={onAskSlotsLeave}
                onClick={(e) => e.stopPropagation()}
                type="button"
              >
                <i className="bx bx-calendar-plus" />
              </button>
            )}
          </div>
        );
      })}
    </>
  );
};

export default MultiSelectList;
