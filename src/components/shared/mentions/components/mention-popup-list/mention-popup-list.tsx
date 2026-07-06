import { useRef, useEffect, useCallback } from "react";
import { MENTIONS_LABELS } from "../../constants";
import type { CommandItem, CommandEntry } from "../../types";
import { groupSlots, getDefaultIcon } from "../../utils";
import SlotTabs from "../slot-tabs/slot-tabs";

type PopupListProps = {
  listItems: CommandItem[];
  filteredEntries: CommandEntry[];
  isListView: boolean;
  isSlotStage: boolean;
  isMultiSelectStage: boolean;
  selectedIndex: number;
  setSelectedIndex: (v: number) => void;
  onSelect: (item: CommandEntry | CommandItem) => void;
  hasMore: boolean | undefined;
  loadMore?: () => void;
  isLoadingMore: boolean | undefined;
  multiSelectedIds: string[];
  onToggleMultiSelect: (id: string) => void;
  showSlotTabs?: boolean;
};

const MentionPopupList = ({
  listItems, filteredEntries, isListView, isSlotStage, isMultiSelectStage,
  selectedIndex, setSelectedIndex, onSelect,
  hasMore, loadMore, isLoadingMore, multiSelectedIds, onToggleMultiSelect,
  showSlotTabs = false,
}: PopupListProps) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current?.querySelector(".mp-item--selected");
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  useEffect(() => {
    if (!isListView || !loadMore || !hasMore || isLoadingMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) loadMore(); },
      { root: bodyRef.current, rootMargin: "100px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isListView, loadMore, hasMore, isLoadingMore]);

  const renderSlotGroups = useCallback(() => {
    const groups = groupSlots(listItems);
    if (groups.length === 0) return <div className="mp-empty">{MENTIONS_LABELS.NO_RESULTS}</div>;
    return groups.map((group) => (
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
    ));
  }, [listItems, selectedIndex, onSelect, setSelectedIndex]);

  const renderListView = useCallback(() => {
    if (listItems.length === 0) return <div className="mp-empty">{MENTIONS_LABELS.NO_RESULTS}</div>;
    return (
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
          </div>
        ))}
        {hasMore && (
          <div ref={sentinelRef} className="mp-sentinel">
            {isLoadingMore && <span className="mp-loading">Loading more...</span>}
          </div>
        )}
      </>
    );
  }, [listItems, selectedIndex, onSelect, setSelectedIndex, hasMore, isLoadingMore]);

  const renderFilteredEntries = useCallback(() => {
    if (filteredEntries.length === 0) return <div className="mp-empty">{MENTIONS_LABELS.NO_RESULTS}</div>;
    return filteredEntries.map((entry, i) => (
      <div
        key={entry.id}
        className={`mp-item${i === selectedIndex ? " mp-item--selected" : ""}`}
        onClick={() => onSelect(entry)}
        onMouseEnter={() => setSelectedIndex(i)}
      >
        {entry.icon || getDefaultIcon(entry.id) ? (
          <div className="mp-item-icon"><i className={entry.icon || getDefaultIcon(entry.id)} /></div>
        ) : (
          <div className="mp-item-avatar">{entry.label.charAt(0).toUpperCase()}</div>
        )}
        <div className="mp-item-content"><div className="mp-item-label">{entry.label}</div></div>
        {(entry.children || entry.fetcher || entry.isWizardAction) && (
          <i className="bx bx-chevron-right mp-item-arrow" />
        )}
      </div>
    ));
  }, [filteredEntries, selectedIndex, onSelect, setSelectedIndex]);

  const renderMultiSelectList = useCallback(() => {
    if (listItems.length === 0) return <div className="mp-empty">{MENTIONS_LABELS.NO_RESULTS}</div>;
    const atMax = multiSelectedIds.length >= 10;
    return listItems.map((item, i) => {
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
        </div>
      );
    });
  }, [listItems, selectedIndex, multiSelectedIds, onToggleMultiSelect, setSelectedIndex]);

  const renderContent = () => {
    if (isSlotStage) {
      if (showSlotTabs) {
        return (
          <SlotTabs
            listItems={listItems}
            selectedIndex={selectedIndex}
            onSelect={onSelect}
            setSelectedIndex={setSelectedIndex}
          />
        );
      }
      return renderSlotGroups();
    }
    if (isMultiSelectStage) return renderMultiSelectList();
    if (isListView) return renderListView();
    return renderFilteredEntries();
  };

  return (
    <div ref={bodyRef} className="mp-body">
      {renderContent()}
    </div>
  );
};

export default MentionPopupList;
