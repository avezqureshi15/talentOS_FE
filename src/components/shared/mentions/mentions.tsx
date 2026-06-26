import React from "react";
import "./mentions.css";
import { MENTIONS_LABELS } from "./mentions.constants";
import type { CommandItem, CommandEntry, MenuLevel } from "./mentions.types";

export type MenuSelection =
  | { action: "insert"; text: string }
  | { action: "navigate"; entry: CommandEntry };

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
  if (entry.children || entry.fetcher) {
    return { action: "navigate", entry };
  }
  return { action: "insert", text: entry.getInsertText?.() ?? entry.label };
}

type MentionPopupProps = {
  show: boolean;
  onInsert: (text: string) => void;
  menu: {
    currentLevel: MenuLevel;
    search: string;
    setSearch: (v: string) => void;
    filteredEntries: CommandEntry[];
    listItems: CommandItem[];
    isListView: boolean;
    activeEntry: CommandEntry | null;
    canGoBack: boolean;
    selectedIndex: number;
    setSelectedIndex: (v: number) => void;
    navigateTo: (entry: CommandEntry) => void;
    goBack: () => void;
  };
};

const ICON_RULES: { match: (id: string) => boolean; icon: string }[] = [
  { match: (id) => id.endsWith("-view"), icon: "bx bx-eye" },
  { match: (id) => id.includes("ping"), icon: "bx bx-message" },
  { match: (id) => id.endsWith("-slots") || id.includes("slot"), icon: "bx bx-timer" },
  { match: (id) => id.includes("ask"), icon: "bx bx-plus-circle" },
];

function getDefaultIcon(id: string): string {
  return ICON_RULES.find((rule) => rule.match(id))?.icon ?? "";
}

const MentionPopup: React.FC<MentionPopupProps> = ({ show, onInsert, menu }) => {
  if (!show) return null;

  const {
    currentLevel,
    search,
    setSearch,
    filteredEntries,
    listItems,
    isListView,
    activeEntry,
    canGoBack,
    selectedIndex,
    setSelectedIndex,
    navigateTo,
    goBack,
  } = menu;

  const handleSelect = (current: CommandEntry | CommandItem) => {
    const result = resolveMenuSelection(current, isListView, activeEntry);
    if (result.action === "navigate") {
      navigateTo(result.entry);
    } else {
      onInsert(result.text);
    }
  };

  return (
    <div className="mention-popup">
      <div className="mp-header">
        {canGoBack && (
          <button className="mp-back" onClick={goBack} type="button">
            <i className="bx bx-chevron-left" />
            <span>{currentLevel.title}</span>
          </button>
        )}
      </div>

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
          autoFocus
        />
      </div>

      <div className="mp-body">
        {isListView ? (
          listItems.length === 0 ? (
            <div className="mp-empty">{MENTIONS_LABELS.NO_RESULTS}</div>
          ) : (
            listItems.map((item, i) => (
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
                  {item.description && (
                    <div className="mp-item-desc">{item.description}</div>
                  )}
                </div>
              </div>
            ))
          )
        ) : filteredEntries.length === 0 ? (
          <div className="mp-empty">{MENTIONS_LABELS.NO_RESULTS}</div>
        ) : (
          filteredEntries.map((entry, i) => (
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
              {(entry.children || entry.fetcher) && (
                <i className="bx bx-chevron-right mp-item-arrow" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MentionPopup;
