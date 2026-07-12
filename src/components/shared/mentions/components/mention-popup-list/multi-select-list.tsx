import type { CommandItem } from "../../types";
import { MAX_SELECTION } from "@/components/ui/chat-input/hooks/use-multi-select";
import AskSlotsButton from "./ask-slots-button";

type MultiSelectListProps = {
  listItems: CommandItem[];
  selectedIndex: number;
  setSelectedIndex: (v: number) => void;
  multiSelectedIds: string[];
  onToggleMultiSelect: (id: string) => void;
  onAskSlotsHover: (e: React.MouseEvent<HTMLButtonElement>, item: CommandItem) => void;
  onAskSlotsLeave: () => void;
  onItemHover?: (e: React.MouseEvent<HTMLDivElement>, item: CommandItem) => void;
  onItemLeave?: () => void;
};

const MultiSelectList = ({
  listItems, selectedIndex, setSelectedIndex,
  multiSelectedIds, onToggleMultiSelect,
  onAskSlotsHover, onAskSlotsLeave, onItemHover, onItemLeave,
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
            <div className="mp-item-avatar" onMouseEnter={(e) => onItemHover?.(e, item)} onMouseLeave={onItemLeave}>{item.label.charAt(0).toUpperCase()}</div>
            <div className="mp-item-content">
              <div className="mp-item-label">{item.label}</div>
              {item.description && <div className="mp-item-desc">{item.description}</div>}
            </div>
            <AskSlotsButton item={item} onAskSlotsHover={onAskSlotsHover} onAskSlotsLeave={onAskSlotsLeave} />
          </div>
        );
      })}
    </>
  );
};

export default MultiSelectList;
