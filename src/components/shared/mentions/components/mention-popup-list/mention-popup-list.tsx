import { useRef, useEffect, useState, useCallback } from "react";
import { MENTIONS_LABELS } from "../../constants";
import type { CommandItem, CommandEntry } from "../../types";
import { getDefaultIcon } from "../../utils";
import SlotTabs from "../slot-tabs/slot-tabs";
import SearchableList from "./searchable-list";
import MultiSelectList from "./multi-select-list";
import InfoChipTooltip from "@/components/shared/info-chip-tooltip/info-chip-tooltip";
import Skeleton from "@/components/ui/skeleton/skeleton";

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
  isLoading: boolean | undefined;
  isLoadingMore: boolean | undefined;
  multiSelectedIds: string[];
  onToggleMultiSelect: (id: string) => void;
  showSlotTabs?: boolean;
};

const MentionPopupList = ({
  listItems, filteredEntries, isListView, isSlotStage, isMultiSelectStage,
  selectedIndex, setSelectedIndex, onSelect,
  hasMore, loadMore, isLoading, isLoadingMore, multiSelectedIds, onToggleMultiSelect,
}: PopupListProps) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const [tooltip, setTooltip] = useState<{ lines: string[]; rect: DOMRect } | null>(null);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideTooltip = useCallback(() => {
    setTooltip(null);
  }, []);

  useEffect(() => {
    return () => {
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const el = bodyRef.current?.querySelector(".mp-item--selected");
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    if (!isListView || !loadMore || !hasMore || isLoadingMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    observerRef.current = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) loadMore(); },
      { root: bodyRef.current, rootMargin: "100px" },
    );
    observerRef.current.observe(sentinel);
  }, [isListView, loadMore, hasMore, isLoadingMore]);

  const buildTooltipLines = useCallback((item: CommandItem): string[] => {
    return [`Ask ${item.label} for Slots`];
  }, []);

  const handleAskSlotsHover = useCallback((e: React.MouseEvent<HTMLButtonElement>, item: CommandItem) => {
    setTooltip({ lines: buildTooltipLines(item), rect: e.currentTarget.getBoundingClientRect() });
  }, [buildTooltipLines]);

  const renderSkeleton = () => (
    <div className="mp-skeleton">
      <div className="mp-skeleton-row"><Skeleton variant="text" width="60%" /><Skeleton variant="text" width="80%" /></div>
      <div className="mp-skeleton-row"><Skeleton variant="text" width="45%" /><Skeleton variant="text" width="90%" /></div>
      <div className="mp-skeleton-row"><Skeleton variant="text" width="70%" /><Skeleton variant="text" width="55%" /></div>
      <div className="mp-skeleton-row"><Skeleton variant="text" width="50%" /><Skeleton variant="text" width="75%" /></div>
    </div>
  );

  const sentinel = hasMore ? (
    <div ref={sentinelRef} className="mp-sentinel">
      {isLoadingMore && <span className="mp-loading">Loading more...</span>}
    </div>
  ) : null;

  const renderContent = () => {
    if (listItems.length === 0 && filteredEntries.length === 0 && isLoading) return renderSkeleton();

    if (isSlotStage) {
      if (listItems.length === 0) return <div className="mp-empty">{MENTIONS_LABELS.NO_RESULTS}</div>;
      return (
        <SlotTabs
          listItems={listItems}
          selectedIndex={selectedIndex}
          onSelect={onSelect}
          setSelectedIndex={setSelectedIndex}
        />
      );
    }
    if (isMultiSelectStage) {
      if (listItems.length === 0) return <div className="mp-empty">{MENTIONS_LABELS.NO_RESULTS}</div>;
      return (
        <>
          <MultiSelectList
            listItems={listItems}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            multiSelectedIds={multiSelectedIds}
            onToggleMultiSelect={onToggleMultiSelect}
            onAskSlotsHover={handleAskSlotsHover}
            onAskSlotsLeave={hideTooltip}
          />
          {sentinel}
        </>
      );
    }
    if (isListView) {
      if (listItems.length === 0) return <div className="mp-empty">{MENTIONS_LABELS.NO_RESULTS}</div>;
      return (
        <>
          <SearchableList
            listItems={listItems}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            onSelect={onSelect}
            onAskSlotsHover={handleAskSlotsHover}
            onAskSlotsLeave={hideTooltip}
          />
          {sentinel}
        </>
      );
    }
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
  };

  return (
    <>
      <div ref={bodyRef} className="mp-body">
        {renderContent()}
      </div>
      {tooltip && <InfoChipTooltip lines={tooltip.lines} rect={tooltip.rect} />}
    </>
  );
};

export default MentionPopupList;
