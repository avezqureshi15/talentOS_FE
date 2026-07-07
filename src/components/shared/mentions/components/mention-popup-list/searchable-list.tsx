import type { CommandItem } from "../../types";

type SearchableListProps = {
  listItems: CommandItem[];
  selectedIndex: number;
  setSelectedIndex: (v: number) => void;
  onSelect: (item: CommandItem) => void;
  onAskSlotsHover: (e: React.MouseEvent<HTMLButtonElement>, item: CommandItem) => void;
  onAskSlotsLeave: () => void;
};

const SearchableList = ({
  listItems, selectedIndex, setSelectedIndex, onSelect,
  onAskSlotsHover, onAskSlotsLeave,
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
    ))}
  </>
);

export default SearchableList;
