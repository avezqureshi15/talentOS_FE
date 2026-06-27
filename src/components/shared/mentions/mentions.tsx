import React, { useRef, useEffect } from "react";
import "./mentions.css";
import { MENTIONS_LABELS, WIZARD_LABELS, ICON_RULES, SLOT_GROUP_ORDER, SLOT_FALLBACK_GROUP } from "./mentions.constants";
import type { CommandItem, CommandEntry, WizardStage, Token, MenuController } from "./mentions.types";
import { WIZARD_ACTIONS } from "./wizard.config";

export type MenuSelection = { action: "insert"; text: string } | { action: "navigate"; entry: CommandEntry } | { action: "wizard"; stage: WizardStage };

export function resolveMenuSelection(
  current: CommandEntry | CommandItem,
  isListView: boolean,
  activeEntry: CommandEntry | null,
): MenuSelection {
  if (isListView) {
    const item = current as CommandItem;
    return { action: "insert", text: activeEntry?.getInsertText?.(item) ?? item.label };
  }
  const entry = current as CommandEntry;
  if (entry.isWizardAction) {
    return { action: "wizard", stage: 0 as WizardStage };
  }
  if (entry.children || entry.fetcher) {
    return { action: "navigate", entry };
  }
  return { action: "insert", text: entry.getInsertText?.() ?? entry.label };
}

function getDefaultIcon(id: string): string {
  return ICON_RULES.find((rule) => rule.match(id))?.icon ?? "";
}

function getStageHeader(stage: WizardStage, tokens: Token[]): string {
  const actionId = tokens[0]?.id;
  const action = actionId ? WIZARD_ACTIONS[actionId] : null;
  return action?.stages[stage - 1]?.header ?? WIZARD_LABELS.STAGE_0_HEADER;
}

function groupSlots(items: CommandItem[]): { group: string; items: CommandItem[] }[] {
  const map = new Map<string, CommandItem[]>();
  for (const item of items) {
    const group = item.description ?? SLOT_FALLBACK_GROUP;
    if (!map.has(group)) map.set(group, []);
    map.get(group)!.push(item);
  }
  const sortKey = (g: string) => { const i = SLOT_GROUP_ORDER.indexOf(g); return i === -1 ? 99 : i; };
  return [...map.entries()].sort(([a], [b]) => sortKey(a) - sortKey(b)).map(([group, items]) => ({ group, items }));
}

const MentionPopup: React.FC<{
  show: boolean;
  onInsert: (text: string) => void;
  onWizardSelect?: (stage: WizardStage, item: CommandItem) => void;
  menu: MenuController;
  wizardStage: WizardStage;
  tokens: Token[];
}> = ({ show, onInsert, onWizardSelect, menu, wizardStage, tokens }) => {
  if (!show) return null;

  const {
    currentLevel, search, setSearch, filteredEntries, listItems,
    isListView, activeEntry, canGoBack, selectedIndex, setSelectedIndex,
    navigateTo, goBack, moveUp, moveDown, selectCurrentItem,
  } = menu;

  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current?.querySelector(".mp-item--selected");
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

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
          const item = current as CommandItem;
          onWizardSelect(wizardStage, item);
        } else {
          onInsert(result.text);
        }
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        moveDown();
        break;
      case "ArrowUp":
        e.preventDefault();
        moveUp();
        break;
      case "Enter":
        if (!e.shiftKey) {
          e.preventDefault();
          const current = selectCurrentItem();
          if (current) handleSelect(current);
        }
        break;
    }
  };

  const headerTitle = isWizardActive ? getStageHeader(wizardStage, tokens) : currentLevel.title || WIZARD_LABELS.STAGE_0_HEADER;

  const renderSlotGroups = () => {
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
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setSelectedIndex(globalIdx)}
            >
              <div className="mp-item-icon mp-item-icon--slot">
                <i className="bx bx-clock" />
              </div>
              <div className="mp-item-content">
                <div className="mp-item-label">{item.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    ));
  };
  const renderListView = () => {
    if (listItems.length === 0) return <div className="mp-empty">{MENTIONS_LABELS.NO_RESULTS}</div>;
    return listItems.map((item, i) => (
      <div
        key={item.id}
        className={`mp-item${i === selectedIndex ? " mp-item--selected" : ""}`}
        onClick={() => handleSelect(item)}
        onMouseEnter={() => setSelectedIndex(i)}
      >
        <div className="mp-item-avatar">
          {item.label.charAt(0).toUpperCase()}
        </div>
        <div className="mp-item-content">
          <div className="mp-item-label">{item.label}</div>
          {item.description && <div className="mp-item-desc">{item.description}</div>}
        </div>
      </div>
    ));
  };
  const renderFilteredEntries = () => {
    if (filteredEntries.length === 0) return <div className="mp-empty">{MENTIONS_LABELS.NO_RESULTS}</div>;
    return filteredEntries.map((entry, i) => (
      <div
        key={entry.id}
        className={`mp-item${i === selectedIndex ? " mp-item--selected" : ""}`}
        onClick={() => handleSelect(entry)}
        onMouseEnter={() => setSelectedIndex(i)}
      >
        {entry.icon || getDefaultIcon(entry.id) ? (
          <div className="mp-item-icon">
            <i className={entry.icon || getDefaultIcon(entry.id)} />
          </div>
        ) : (
          <div className="mp-item-avatar">
            {entry.label.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="mp-item-content">
          <div className="mp-item-label">{entry.label}</div>
        </div>
        {(entry.children || entry.fetcher || entry.isWizardAction) && (
          <i className="bx bx-chevron-right mp-item-arrow" />
        )}
      </div>
    ));
  };
  const renderListItems = () => {
    if (wizardStage === 3) return renderSlotGroups();
    if (isListView) return renderListView();
    return renderFilteredEntries();
  };

  return (
    <div className="mention-popup">
      {(canGoBack || isWizardActive) && (
        <div className="mp-header">
          {canGoBack && (
            <button className="mp-back" onClick={goBack} type="button">
              <i className="bx bx-chevron-left" />
              <span>{currentLevel.title}</span>
            </button>
          )}
          {isWizardActive && (
            <span className="mp-wizard-step-label">{headerTitle}</span>
          )}
        </div>
      )}
      <div className="mp-search-wrapper">
        <i className="bx bx-search mp-search-icon" />
        <input
          className="mp-search"
          placeholder={
            isListView && activeEntry?.searchPlaceholder
              ? activeEntry.searchPlaceholder
              : MENTIONS_LABELS.SEARCH
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          autoFocus
        />
      </div>
      <div ref={bodyRef} className="mp-body">
        {renderListItems()}
      </div>
    </div>
  );
};

export default MentionPopup;
