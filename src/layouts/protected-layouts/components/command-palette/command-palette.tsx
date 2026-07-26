import { useEffect, useRef, useCallback } from "react";
import "./command-palette.css";
import type { CommandPaletteProps, SearchResultItem } from "./command-palette.types";
import type { CommandPaletteSection } from "./command-palette.types";
import { COMMAND_PALETTE_LABELS } from "./command-palette.constants";
import BaseModal from "@/components/ui/modal/base-modal";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";

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

const getItemIcon = (type: SearchResultItem["type"]) =>
  type === "action" ? "bx bx-plus-circle" : "bx bx-briefcase";

const getItemIconClass = (type: SearchResultItem["type"]) =>
  type === "action" ? "cp-item-icon cp-item-icon--action" : "cp-item-icon cp-item-icon--request";

export default function CommandPalette({
  open,
  onClose,
  query,
  onQueryChange,
  sections,
  selectedIndex,
  onKeyDown,
  onSelectHiringRequest,
  onNewChat,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: CommandPaletteProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const sentinelRef = useIntersectionObserver(
    useCallback(() => {
      if (hasMore && !isLoadingMore) {
        onLoadMore?.();
      }
    }, [hasMore, isLoadingMore, onLoadMore]),
    !!hasMore && !isLoadingMore,
  );

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const handleItemClick = useCallback(
    (item: SearchResultItem) => {
      if (item.type === "action") {
        onNewChat();
      } else {
        onSelectHiringRequest(item.id);
      }
      onClose();
    },
    [onNewChat, onSelectHiringRequest, onClose],
  );

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
          {sections.length === 0 || sections.every((s) => s.items.length === 0) ? (
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

          {isLoadingMore && (
            <div className="cp-loading-more">
              <LoadingSpinner size="sm" />
            </div>
          )}

          <div ref={sentinelRef} className="cp-scroll-sentinel" />
        </div>
      </div>
    </BaseModal>
  );
}
