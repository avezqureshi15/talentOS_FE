import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { springSoft } from "@/utils/motion";
import type { FilterPopoverProps } from "./filter-popover.types";
import "./filter-popover.css";

const FilterPopover = ({
  children,
  label = "Filters",
  icon = "bx bx-filter",
  activeCount = 0,
  disabled = false,
  className = "",
}: FilterPopoverProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<number | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => () => clearCloseTimer(), []);

  return (
    <div
      className={`filter-popover-wrapper${className ? ` ${className}` : ""}`}
      ref={wrapperRef}
      onMouseEnter={() => {
        if (disabled) return;
        clearCloseTimer();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className={`filter-popover-trigger${open ? " filter-popover-trigger--active" : ""}${activeCount > 0 ? " filter-popover-trigger--has-active" : ""}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
      >
        <i className={icon} aria-hidden />
        {label}
        {activeCount > 0 && <span className="filter-popover-count">{activeCount}</span>}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="filter-popover"
            role="dialog"
            aria-label={label}
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={springSoft}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterPopover;
