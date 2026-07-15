import { useLayoutEffect, useRef, useState, useMemo, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import "./mention-popup.css";
import { MENTIONS_LABELS } from "../constants";
import { COMMON_SLOTS_TAB_ID } from "./slot-tabs/slot-tabs.constants";
import type { CommandItem, CommandEntry, WizardStage, Token, MenuController } from "../types";
import { resolveMenuSelection } from "../utils";
import MentionPopupHeader from "./mention-popup-header/mention-popup-header";
import MentionPopupList from "./mention-popup-list/mention-popup-list";
import MentionPopupSearch from "./mention-popup-search";
import MentionPopupSidebar from "./mention-popup-sidebar";

export { resolveMenuSelection, type MenuSelection } from "../utils";

type MentionPopupProps = {
  show: boolean;
  onInsert: (text: string) => void;
  onWizardSelect?: (stage: WizardStage, item: CommandItem) => void;
  multiSelectedIds?: string[];
  onToggleMultiSelect?: (itemId: string) => void;
  menu: MenuController;
  wizardStage: WizardStage;
  isMultiSelectStage: boolean;
  tokens: Token[];
  anchorRef: React.RefObject<HTMLDivElement | null>;
  onInterviewerChange?: (interviewerId: string) => void;
};

const POPUP_WIDTH = 300;
const GAP = 8;
const ANIM_DURATION = 200;

  const MentionPopup = ({
  show, onInsert, onWizardSelect, multiSelectedIds, onToggleMultiSelect, menu, wizardStage, isMultiSelectStage, tokens, anchorRef, onInterviewerChange,
}: MentionPopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);
  // justification: tracks popup position computed from anchor rect
  const [style, setStyle] = useState<React.CSSProperties>({ visibility: "hidden" });

  // justification: sidebar mount/unmount state for animation
  const [sidebarMounted, setSidebarMounted] = useState(false);
  // justification: sidebar closing animation phase
  const [sidebarClosing, setSidebarClosing] = useState(false);
  // justification: tracks which interviewer tab is selected in sidebar
  const [activeTab, setActiveTab] = useState(COMMON_SLOTS_TAB_ID);
  const sidebarTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interviewerTokens = useMemo(
    () => tokens.filter((t) => t.type === "interviewer").map((t) => ({ id: t.id, name: t.label, relationalId: t.relationalId })),
    [tokens],
  );
  const showSidebar = interviewerTokens.length > 1 && wizardStage === 4;
  // justification: locks popup scroll when sidebar mounts to prevent double scroll
  useEffect(() => {
    const el = popupRef.current;
    if (!el) return;
    el.style.overflow = sidebarMounted ? "hidden" : "";
    return () => { if (el) el.style.overflow = ""; };
  }, [sidebarMounted]);
  // justification: cleanup sidebar animation timer on unmount
  useEffect(() => {
    return () => { if (sidebarTimerRef.current) clearTimeout(sidebarTimerRef.current); };
  }, []);

  const openSidebar = useCallback(() => {
    if (sidebarTimerRef.current) clearTimeout(sidebarTimerRef.current);
    setSidebarClosing(false);
    setSidebarMounted(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarClosing(true);
    sidebarTimerRef.current = setTimeout(() => {
      setSidebarMounted(false);
      setSidebarClosing(false);
      sidebarTimerRef.current = null;
    }, ANIM_DURATION);
  }, []);

  const handleSidebarSelect = useCallback((tabId: string) => {
    setActiveTab(tabId);
    onInterviewerChange?.(tabId);
    closeSidebar();
  }, [closeSidebar, onInterviewerChange]);

  const { currentLevel, search, setSearch, filteredEntries, listItems, isListView, activeEntry, canGoBack, selectedIndex, setSelectedIndex, navigateTo, goBack, moveUp, moveDown, selectCurrentItem, loadMore, hasMore, isLoading, isLoadingMore } = menu;
  const isSlotStage = wizardStage === 4;
  const isWizardActive = wizardStage > 0;

  const handleSelect = useCallback((current: CommandEntry | CommandItem) => {
    const result = resolveMenuSelection(current, isListView, activeEntry);
    switch (result.action) {
      case "wizard": {
        onWizardSelect?.(result.stage, current as CommandItem);
        break;
      }
      case "navigate":
        navigateTo(result.entry);
        break;
      default:
        if (isWizardActive && onWizardSelect && activeEntry) {
          onWizardSelect(wizardStage, current as CommandItem);
        } else {
          onInsert(result.text);
        }
    }
  }, [isListView, activeEntry, isWizardActive, wizardStage, onWizardSelect, navigateTo, onInsert]);

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown": e.preventDefault(); moveDown(); break;
      case "ArrowUp": e.preventDefault(); moveUp(); break;
      case "Enter":
        if (!e.shiftKey) {
          e.preventDefault();
          const current = selectCurrentItem();
          if (current) handleSelect(current);
        }
        break;
    }
  }, [moveDown, moveUp, selectCurrentItem, handleSelect]);

  // justification: computes popup position relative to the anchor element
  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    if (!show || !anchor) return;
    const rect = anchor.getBoundingClientRect();
    setStyle({
      position: "fixed",
      bottom: `${window.innerHeight - rect.top + GAP}px`,
      left: `${rect.left}px`,
      width: `${POPUP_WIDTH}px`,
      minHeight: "220px",
      maxHeight: "300px",
      overflowY: "auto",
    });
  }, [show, anchorRef]);

  if (!show) return null;

  const multiIds = multiSelectedIds ?? [];
  const toggleMulti = onToggleMultiSelect ?? (() => {});

  const searchPlaceholder = isListView && activeEntry?.searchPlaceholder ? activeEntry.searchPlaceholder : MENTIONS_LABELS.SEARCH;
  const activeInterviewerName = activeTab === COMMON_SLOTS_TAB_ID ? null : interviewerTokens.find((iv) => iv.id === activeTab)?.name ?? null;

  const popup = (
    <div ref={popupRef} className="mention-popup" style={style}>
      <MentionPopupHeader
        canGoBack={canGoBack}
        goBack={goBack}
        currentLevelTitle={currentLevel.title}
        isWizardActive={isWizardActive}
        wizardStage={wizardStage}
        tokens={tokens}
        multiLength={multiIds.length}
      />
      <MentionPopupSearch
        search={search}
        onSearch={setSearch}
        onKeyDown={handleSearchKeyDown}
        placeholder={searchPlaceholder}
        showSidebar={showSidebar}
        onToggleSidebar={openSidebar}
      />
      <MentionPopupList
        listItems={listItems}
        filteredEntries={filteredEntries}
        isListView={isListView}
        isSlotStage={isSlotStage}
        isMultiSelectStage={isMultiSelectStage}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        onSelect={handleSelect}
        hasMore={hasMore}
        loadMore={loadMore}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        multiSelectedIds={multiIds}
        onToggleMultiSelect={toggleMulti}
        showSlotTabs={showSidebar}
      />
      <MentionPopupSidebar
        mounted={sidebarMounted}
        closing={sidebarClosing}
        activeTab={activeTab}
        interviewerTokens={interviewerTokens}
        activeInterviewerName={activeInterviewerName}
        onSelect={handleSidebarSelect}
        onClose={closeSidebar}
      />
    </div>
  );
  return createPortal(popup, document.body);
};

export default MentionPopup;
