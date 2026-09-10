import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  CANDIDATE_ACTIONS_TRIGGER_LABEL,
  CANDIDATE_ACTION_META,
  SCHEDULE_ELIGIBLE_STATUSES,
} from "./candidate-actions-menu.constants";
import type {
  CandidateActionKey,
  CandidateActionsMenuProps,
} from "./candidate-actions-menu.types";
import "./candidate-actions-menu.css";

const MENU_OFFSET_PX = 6;

const CandidateActionsMenu = ({ candidate, onViewProfile, onScheduleRound, compact }: CandidateActionsMenuProps) => {
  // UI-only state: dropdown open flag + anchor rect used to position the
  // portaled menu (portal keeps the popover on top of the table's overflow).
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click, Escape, or any scroll — matches most UI-kit
  // dropdowns and avoids tracking the anchor while the page scrolls.
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const handleScroll = () => setOpen(false);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [open]);

  const canSchedule = !!onScheduleRound && SCHEDULE_ELIGIBLE_STATUSES.has(candidate.status);
  // Primary action goes first (Schedule Human Round when eligible,
  // HR Review Needed otherwise — both surface intent at a glance);
  // View Profile always sits second.
  const items: CandidateActionKey[] = [
    canSchedule ? "schedule_round" : "review_candidate",
    "view_profile",
  ];

  const handleSelect = (key: CandidateActionKey) => {
    setOpen(false);
    if (key === "schedule_round" && onScheduleRound) {
      onScheduleRound(candidate);
      return;
    }
    onViewProfile(candidate);
  };

  const handleTriggerClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!open && triggerRef.current) {
      setAnchor(triggerRef.current.getBoundingClientRect());
    }
    setOpen((o) => !o);
  };

  return (
    <div className="cam">
      <button
        ref={triggerRef}
        type="button"
        className={`cam-trigger${compact ? " cam-trigger--compact" : ""}`}
        title={CANDIDATE_ACTIONS_TRIGGER_LABEL}
        aria-label={CANDIDATE_ACTIONS_TRIGGER_LABEL}
        aria-expanded={open}
        onClick={handleTriggerClick}
      >
        {compact ? (
          <i className="bx bx-dots-vertical-rounded cam-trigger-dots" />
        ) : (
          <>
            <span className="cam-trigger-label">{CANDIDATE_ACTIONS_TRIGGER_LABEL}</span>
            <i className={`bx bx-chevron-down cam-trigger-chevron${open ? " cam-trigger-chevron--open" : ""}`} />
          </>
        )}
      </button>

      {open && anchor &&
        createPortal(
          <div
            ref={menuRef}
            className="cam-menu"
            style={{
              top: anchor.bottom + MENU_OFFSET_PX,
              left: anchor.right,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {items.map((key) => {
              const meta = CANDIDATE_ACTION_META[key];
              const isDestructive = meta.variant === "destructive";
              return (
                <button
                  key={key}
                  type="button"
                  className={`cam-item${isDestructive ? " cam-item--destructive" : ""}`}
                  onClick={() => handleSelect(key)}
                >
                  <i className={`bx ${meta.icon}`} />
                  <span>{meta.label}</span>
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
};

export default CandidateActionsMenu;
