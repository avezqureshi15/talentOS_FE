import { useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { SR_LABELS, SLOT_GROUP_ORDER, SLOT_FALLBACK_GROUP, AI_ID } from "./schedule-round-modal.constants";
import { askSlotsForEmployee } from "@/components/shared/mentions/services/ask-slots.service";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";
import InfoChipTooltip from "@/components/shared/info-chip-tooltip/info-chip-tooltip";
import type { Interviewer, SlotTab } from "./schedule-round-modal.types";
import type { CommandItem } from "@/components/shared/mentions/types";

type SrStep1Props = {
  search: string;
  onSearchChange: (v: string) => void;
  interviewers: Interviewer[];
  selectedInterviewers: Interviewer[];
  onSelectInterviewer: (iv: Interviewer) => void;
  tabs: SlotTab[];
  activeTab: string | null;
  onTabChange: (tabId: string) => void;
  activeSlots: CommandItem[];
  selectedSlotId: string | null;
  onSlotSelect: (slotId: string) => void;
  isLoading: boolean;
  isSearching: boolean;
  hideSearch?: boolean;
};

const slotsLabel = (count: number): string => {
  if (count === 0) return SR_LABELS.NO_SLOTS_AVAILABLE;
  return SR_LABELS.SLOTS_AVAILABLE.replace("{count}", String(count)).replace("{plural}", count === 1 ? "" : "s");
};

const groupSlots = (items: CommandItem[]) => {
  const map = new Map<string, CommandItem[]>();
  for (const item of items) {
    const group = item.description ?? SLOT_FALLBACK_GROUP;
    if (!map.has(group)) map.set(group, []);
    map.get(group)!.push(item);
  }
  const sortKey = (g: string) => { const i = SLOT_GROUP_ORDER.indexOf(g); return i === -1 ? 99 : i; };
  return [...map.entries()].sort(([a], [b]) => sortKey(a) - sortKey(b)).map(([group, items]) => ({ group, items }));
};

const SrStep1 = ({ search, onSearchChange, interviewers, selectedInterviewers, onSelectInterviewer, tabs, activeTab, onTabChange, activeSlots, selectedSlotId, onSlotSelect, isLoading, isSearching, hideSearch }: SrStep1Props) => {
  const isSelected = (iv: Interviewer) => selectedInterviewers.some((s) => s.id === iv.id);
  // justification: stores tooltip state for avatar hover (name + designation)
  const [tooltip, setTooltip] = useState<{ lines: string[]; rect: DOMRect } | null>(null);
  // justification: stores tooltip state for ask-slots button hover
  const [askTooltip, setAskTooltip] = useState<{ lines: string[]; rect: DOMRect } | null>(null);

  const clearTooltip = useCallback(() => setTooltip(null), []);
  const clearAskTooltip = useCallback(() => setAskTooltip(null), []);

  const handleAvatarHover = useCallback((e: React.MouseEvent<HTMLDivElement>, iv: Interviewer) => {
    setAskTooltip(null);
    setTooltip({ lines: [iv.name, iv.designation], rect: e.currentTarget.getBoundingClientRect() });
  }, []);

  const handleAskSlotsHover = useCallback((e: React.MouseEvent<HTMLButtonElement>, iv: Interviewer) => {
    setTooltip(null);
    setAskTooltip({ lines: [SR_LABELS.ASK_SLOTS_TOOLTIP.replace("{name}", iv.name)], rect: e.currentTarget.getBoundingClientRect() });
  }, []);

  const handleAskSlotsClick = useCallback(async (e: React.MouseEvent<HTMLButtonElement>, iv: Interviewer) => {
    e.stopPropagation();
    try {
      const data = await askSlotsForEmployee(iv.emp_id);
      const result = data.results?.[0];
      if (result?.status === "SUCCESS") {
        useToastStore.getState().addToast(data.message, ToastType.SUCCESS);
      } else {
        useToastStore.getState().addToast(result?.message ?? SR_LABELS.ASK_SLOTS_FAILED, ToastType.ERROR);
      }
    } catch {
      useToastStore.getState().addToast(SR_LABELS.ASK_SLOTS_ERROR, ToastType.ERROR);
    }
  }, []);

  const groups = useMemo(() => groupSlots(activeSlots), [activeSlots]);

  const renderSkeleton = () => (
    <div className="sr-slot-list-skeleton">
      {[0, 1, 2].map((i) => (
        <div key={i} className="sr-skeleton-group">
          <div className="sr-skeleton-block sr-skeleton-block--header" />
          <div className="sr-skeleton-block sr-skeleton-block--item" />
          <div className="sr-skeleton-block sr-skeleton-block--item" />
        </div>
      ))}
    </div>
  );

  const renderSlotList = () => (
    <div className="sr-slot-list">
      {groups.map((group) => (
        <div key={group.group} className="sr-slot-group">
          <div className="sr-slot-group-header">{group.group}</div>
          <div className="sr-slot-group-items">
            {group.items.map((item) => (
              <div
                key={item.id}
                className={`sr-slot-item${selectedSlotId === item.id ? " sr-slot-item--selected" : ""}`}
                onClick={() => onSlotSelect(item.id)}
              >
                <i className="bx bx-clock sr-slot-item-icon" />
                <span className="sr-slot-item-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="sr-two-col">
      {!hideSearch && <div className="sr-left-col">
        <div className="sr-interviewer-search">
          <i className="bx bx-search sr-search-icon" />
          <input className="sr-search-input" placeholder={SR_LABELS.INTERVIEWER_PLACEHOLDER} value={search} onChange={(e) => onSearchChange(e.target.value)} />
        </div>
        <div className="sr-interviewer-list">
          <button
            key={AI_ID}
            className={`sr-interviewer-item sr-interviewer-item--ai ${selectedInterviewers.some((s) => s.id === AI_ID) ? "sr-interviewer-item--selected" : ""}`}
            onClick={() => onSelectInterviewer({
              id: AI_ID, emp_id: AI_ID, name: SR_LABELS.AI_NAME,
              designation: "AI", department: "", email: "", slots_count: -1, has_slots: true,
            })}
            type="button"
          >
            <div className="sr-interviewer-avatar sr-interviewer-avatar--ai">
              <i className="bx bx-sparkles" />
            </div>
            <div className="sr-interviewer-info">
              <span className="sr-interviewer-name">{SR_LABELS.AI_NAME}</span>
              <span className="sr-interviewer-slots sr-interviewer-slots--ai">{SR_LABELS.AI_SLOTS_LABEL}</span>
            </div>
            {selectedInterviewers.some((s) => s.id === AI_ID) && <i className="bx bx-check sr-interviewer-check" />}
          </button>
          {isSearching ? (
            <div className="sr-empty-slots">{SR_LABELS.SEARCH_LOADING}</div>
          ) : (
            interviewers.map((iv) => (
              <button key={iv.id} className={`sr-interviewer-item ${isSelected(iv) ? "sr-interviewer-item--selected" : ""}`} onClick={() => onSelectInterviewer(iv)} type="button">
                <div className="sr-interviewer-avatar" onMouseEnter={(e) => handleAvatarHover(e, iv)} onMouseLeave={clearTooltip}>{iv.name.charAt(0)}</div>
                <div className="sr-interviewer-info">
                  <span className="sr-interviewer-name">{iv.name}</span>
                  <span className="sr-interviewer-slots">{slotsLabel(iv.slots_count)}</span>
                </div>
                <button className="sr-interviewer-ask-slots" onMouseEnter={(e) => handleAskSlotsHover(e, iv)} onMouseLeave={clearAskTooltip} onClick={(e) => handleAskSlotsClick(e, iv)} type="button">
                  <i className="bx bx-calendar-plus" />
                </button>
                {isSelected(iv) && <i className="bx bx-check sr-interviewer-check" />}
              </button>
            ))
          )}
        </div>
      </div>}
      <div className="sr-right-col">
        {selectedInterviewers.length > 0 ? (
          <div className="sr-slot-section">
            <span className="sr-section-label">{SR_LABELS.SELECT_SLOT}</span>
            {tabs.length > 0 && (
              <div className="sr-tabs-row">
                {tabs.map((tab) => (
                  <button key={tab.id} className={`sr-tab ${activeTab === tab.id ? "sr-tab--active" : ""}`} onClick={() => onTabChange(tab.id)} type="button">
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
            {isLoading ? (
              renderSkeleton()
            ) : activeSlots.length > 0 ? (
              renderSlotList()
            ) : (
              <div className="sr-empty-slots">{SR_LABELS.NO_SLOTS}</div>
            )}
          </div>
        ) : (
          <div className="sr-empty-slots">{SR_LABELS.NO_INTERVIEWER}</div>
        )}
      </div>

      {tooltip && createPortal(<InfoChipTooltip lines={tooltip.lines} rect={tooltip.rect} />, document.body)}
      {askTooltip && createPortal(<InfoChipTooltip lines={askTooltip.lines} rect={askTooltip.rect} />, document.body)}
    </div>
  );
};

export default SrStep1;
