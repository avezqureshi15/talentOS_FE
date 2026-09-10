import { groupSlots } from "../../utils";
import { MENTIONS_LABELS } from "../../constants";
import type { SlotTabsProps } from "./slot-tabs.types";
import "./slot-tabs.css";

const SlotTabs = ({ listItems, onSelect, selectedIndex, setSelectedIndex }: SlotTabsProps) => {
  const groups = groupSlots(listItems);
  if (groups.length === 0) return <div className="mp-empty">{MENTIONS_LABELS.NO_RESULTS}</div>;

  return (
    <>
      {groups.map((group) => (
        <div key={group.group} className="mp-slot-group">
          <div className="mp-slot-group-header">{group.group}</div>
          {group.items.map((item) => {
            const globalIdx = listItems.indexOf(item);
            return (
              <div
                key={item.id}
                className={`mp-item${globalIdx === selectedIndex ? " mp-item--selected" : ""}`}
                onClick={() => onSelect(item)}
                onMouseEnter={() => setSelectedIndex(globalIdx)}
              >
                <div className="mp-item-icon mp-item-icon--slot"><i className="bx bx-clock" /></div>
                <div className="mp-item-content">
                  <div className="mp-item-label">{item.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
};

export default SlotTabs;
