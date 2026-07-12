import type { CommandItem } from "../../types";
import AskSlotsButton from "./ask-slots-button";

type SearchableListProps = {
  listItems: CommandItem[];
  selectedIndex: number;
  setSelectedIndex: (v: number) => void;
  onSelect: (item: CommandItem) => void;
  onAskSlotsHover: (e: React.MouseEvent<HTMLButtonElement>, item: CommandItem) => void;
  onAskSlotsLeave: () => void;
  onItemHover?: (e: React.MouseEvent<HTMLDivElement>, item: CommandItem) => void;
  onItemLeave?: () => void;
};

const SearchableList = ({
  listItems, selectedIndex, setSelectedIndex, onSelect,
  onAskSlotsHover, onAskSlotsLeave, onItemHover, onItemLeave,
}: SearchableListProps) => (
  <>
    {listItems.map((item, i) => (
      <div
        key={item.id}
        className={`mp-item${i === selectedIndex ? " mp-item--selected" : ""}`}
        onClick={() => onSelect(item)}
        onMouseEnter={() => setSelectedIndex(i)}
      >
        {item.meta?.status && <span className={`mp-item-status-dot mp-item-status-dot--${item.meta.status}`} />}
        <div className="mp-item-avatar" onMouseEnter={(e) => onItemHover?.(e, item)} onMouseLeave={onItemLeave}>{item.label.charAt(0).toUpperCase()}</div>
        <div className="mp-item-content">
          <div className="mp-item-label">{item.label}</div>
          {item.description && <div className="mp-item-desc">{item.description}</div>}
        </div>
        <AskSlotsButton item={item} onAskSlotsHover={onAskSlotsHover} onAskSlotsLeave={onAskSlotsLeave} />
      </div>
    ))}
  </>
);

export default SearchableList;
