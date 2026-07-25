import { useEffect, useRef, useCallback } from "react";
import "./command-palette.css";
import type { SearchResultItem, CommandPaletteSection } from "./command-palette.types";
import { COMMAND_PALETTE_LABELS } from "./command-palette.constants";
import BaseModal from "@/components/ui/modal/base-modal";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";

type Props = {
  open: boolean;
  query: string;
  onQueryChange: (q: string) => void;
  sections: CommandPaletteSection[];
  selectedIndex: number;
  onClose: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isSearching: boolean;
  onSelectItem?: (item: SearchResultItem) => void;
};

const getSelectedSectionItem = (
  sections: CommandPaletteSection[],
  flatIndex: number,
): { sectionIdx: number; itemIdx: number } | null => {
  let count = 0;
  for (let si = 0; si < sections.length; si++) {
    for (let ii = 0; ii < sections[si].items.length; ii++) {
      if (count === flatIndex) return { sectionIdx: si, itemIdx: ii };
      count++;
    }
  }
  return null;
};

const getItemIcon = (type: SearchResultItem["type"]) => {
  const icons: Record<string, string> = {
    action: "bx bx-plus-circle",
    "hiring-request": "bx bx-briefcase",
    tenant: "bx bx-building",
  };
  return icons[type] ?? "bx bx-circle";
};

const getItemIconClass = (type: SearchResultItem["type"]) => {
  const classes: Record<string, string> = {
    action: "cp-item-icon cp-item-icon--action",
    "hiring-request": "cp-item-icon cp-item-icon--request",
    tenant: "cp-item-icon cp-item-icon--request",
  };
  return classes[type] ?? "cp-item-icon cp-item-icon--request";
};

export default function CommandPalette({
  open,
  onClose,
  query,
  onQueryChange,
  sections,
  selectedIndex,
  onKeyDown,
  isSearching,
  onSelectItem,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const handleItemClick = useCallback(
    (item: SearchResultItem) => {
      onSelectItem?.(item);
      onClose();
    },
    [onClose, onSelectItem],
  );

  const isEmpty = sections.length === 0 || sections.every((s) => s.items.length === 0);

  return (
    <BaseModal open={open} onClose={onClose} className="command-palette-modal">
      <div className="cp-inner" onKeyDown={onKeyDown}>
        <div className="cp-input-wrapper">
          <i className="bx bx-search cp-input-icon" />
          <input
            ref={inputRef}
            className="cp-input"
            type="text"
            placeholder={COMMAND_PALETTE_LABELS.PLACEHOLDER}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
          <span className="cp-shortcut-hint">ESC</span>
        </div>

        <div className="cp-body">
          {isSearching ? (
            <div className="cp-loading-more">
              <LoadingSpinner size="sm" />
            </div>
          ) : isEmpty ? (
            <div className="cp-empty">{COMMAND_PALETTE_LABELS.NO_RESULTS}</div>
          ) : (
            sections.map((section) =>
              section.items.length > 0 ? (
                <div key={section.title}>
                  <div className="cp-section-title">{section.title}</div>
                  {section.items.map((item) => {
                    const sel = getSelectedSectionItem(sections, selectedIndex);
                    const isSelected =
                      sel !== null &&
                      sections[sel.sectionIdx].title === section.title &&
                      sections[sel.sectionIdx].items[sel.itemIdx].id === item.id;

                    return (
                      <button
                        key={item.id}
                        className={`cp-item ${isSelected ? "cp-item--selected" : ""}`}
                        onClick={() => handleItemClick(item)}
                        type="button"
                      >
                        <span className={getItemIconClass(item.type)}>
                          <i className={getItemIcon(item.type)} />
                        </span>
                        <div>
                          <div className="cp-item-label">{item.label}</div>
                          <div className="cp-item-sublabel">{item.sublabel}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : null,
            )
          )}
        </div>
      </div>
    </BaseModal>
  );
}
