import { useLayoutEffect, useRef, useState, useMemo, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import "./mention-popup.css";
import { MENTIONS_LABELS } from "../constants";
import { WIZARD_ACTIONS } from "../config/wizard.config";
import { COMMON_SLOTS_TAB_ID, COMMON_SLOTS_TAB_LABEL } from "./slot-tabs/slot-tabs.constants";
import type { CommandItem, CommandEntry, WizardStage, Token, MenuController } from "../types";
import { resolveMenuSelection } from "../utils";
import MentionPopupHeader from "./mention-popup-header/mention-popup-header";
import MentionPopupList from "./mention-popup-list/mention-popup-list";

export type { MenuSelection } from "../utils";
export { resolveMenuSelection } from "../utils";

type MentionPopupProps = {
  show: boolean;
  onInsert: (text: string) => void;
  onWizardSelect?: (stage: WizardStage, item: CommandItem) => void;
  multiSelectedIds?: string[];
  onToggleMultiSelect?: (itemId: string) => void;
  menu: MenuController;
  wizardStage: WizardStage;
  tokens: Token[];
  anchorRef: React.RefObject<HTMLDivElement | null>;
};

const POPUP_WIDTH = 300;
const GAP = 8;
const ANIM_DURATION = 200;

const MentionPopup = ({
  show, onInsert, onWizardSelect, multiSelectedIds, onToggleMultiSelect, menu, wizardStage, tokens, anchorRef,
}: MentionPopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({ visibility: "hidden" });

  /* ── sidebar state ── */
  const [sidebarMounted, setSidebarMounted] = useState(false);
  const [sidebarClosing, setSidebarClosing] = useState(false);
  const [activeTab, setActiveTab] = useState(COMMON_SLOTS_TAB_ID);
  const sidebarTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const interviewerTokens = useMemo(
    () => tokens.filter((t) => t.type === "interviewer").map((t) => ({ id: t.id, name: t.label })),
    [tokens],
  );
  const showSidebar = interviewerTokens.length > 1 && wizardStage === 4;

  /* Lock popup scroll when sidebar is mounted */
  useEffect(() => {
    const el = popupRef.current;
    if (!el) return;
    el.style.overflow = sidebarMounted ? "hidden" : "";
    return () => { if (el) el.style.overflow = ""; };
  }, [sidebarMounted]);

  /* Cleanup sidebar timer */
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
    closeSidebar();
  }, [closeSidebar]);

  /* ── wizard helpers ── */
  const wizardActionId = tokens[0]?.id ?? "";
  const isMultiSelectStage = useMemo(() => {
    if (!wizardActionId || wizardStage === 0) return false;
    const stage = WIZARD_ACTIONS[wizardActionId]?.stages[wizardStage - 1];
    return stage?.isMultiSelect ?? false;
  }, [wizardActionId, wizardStage]);

  useLayoutEffect(() => {
    if (!show || !anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setStyle({
      position: "fixed",
      bottom: `${window.innerHeight - rect.top + GAP}px`,
      left: `${rect.left}px`,
      width: `${POPUP_WIDTH}px`,
      maxHeight: "300px",
      overflowY: "auto",
    });
  }, [show, anchorRef]);

  if (!show) return null;

  const {
    currentLevel, search, setSearch, filteredEntries, listItems,
    isListView, activeEntry, canGoBack, selectedIndex, setSelectedIndex,
    navigateTo, goBack, moveUp, moveDown, selectCurrentItem,
    loadMore, hasMore, isLoadingMore,
  } = menu;

  const multiIds = multiSelectedIds ?? [];
  const toggleMulti = onToggleMultiSelect ?? (() => {});
  const isSlotStage = wizardStage === 4;
  const isWizardActive = wizardStage > 0;

  const handleSelect = (current: CommandEntry | CommandItem) => {
    const result = resolveMenuSelection(current, isListView, activeEntry);
    switch (result.action) {
      case "wizard": {
        const entry = current as CommandEntry;
        onWizardSelect?.(result.stage, { id: entry.id, label: entry.label });
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
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
  };

  const activeInterviewerName = activeTab === COMMON_SLOTS_TAB_ID
    ? null
    : interviewerTokens.find((iv) => iv.id === activeTab)?.name ?? null;

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
      <div className="mp-search-wrapper">
        <i className="bx bx-search mp-search-icon" />
        <input
          className="mp-search"
          placeholder={isListView && activeEntry?.searchPlaceholder ? activeEntry.searchPlaceholder : MENTIONS_LABELS.SEARCH}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          autoFocus
        />
        {showSidebar && (
          <button
            type="button"
            className="st-toggle"
            onClick={openSidebar}
            aria-label="Select slot view"
            title="Filter by interviewer"
          >
            <i className="bx bx-menu" />
          </button>
        )}
      </div>
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
        isLoadingMore={isLoadingMore}
        multiSelectedIds={multiIds}
        onToggleMultiSelect={toggleMulti}
        showSlotTabs={showSidebar}
      />
      {sidebarMounted && (
        <>
          <div
            className={`st-backdrop${sidebarClosing ? " st-backdrop--closing" : ""}`}
            onClick={closeSidebar}
          />
          <aside className={`st-sidebar${sidebarClosing ? " st-sidebar--closing" : ""}`}>
            <div className="st-sidebar-head">
              <span>Slot View</span>
              <button type="button" className="st-sidebar-close" onClick={closeSidebar}>
                <i className="bx bx-x" />
              </button>
            </div>
            <div className="st-sidebar-body">
              <div className="st-section-label">Interviewers</div>
              <button
                type="button"
                className={`st-sidebar-item${activeTab === COMMON_SLOTS_TAB_ID ? " st-sidebar-item--active" : ""}`}
                onClick={() => handleSidebarSelect(COMMON_SLOTS_TAB_ID)}
              >
                {COMMON_SLOTS_TAB_LABEL}
              </button>
              {interviewerTokens.map((iv) => (
                <button
                  key={iv.id}
                  type="button"
                  className={`st-sidebar-item${activeTab === iv.id ? " st-sidebar-item--active" : ""}`}
                  onClick={() => handleSidebarSelect(iv.id)}
                >
                  {iv.name}
                </button>
              ))}
            </div>
            <div className="st-sidebar-foot">
              {activeInterviewerName
                ? `Showing ${activeInterviewerName}'s slots`
                : "Showing common availability"}
            </div>
          </aside>
        </>
      )}
    </div>
  );

  return createPortal(popup, document.body);
};

export default MentionPopup;
