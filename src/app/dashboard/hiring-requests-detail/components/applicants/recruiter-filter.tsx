import { useState, useRef, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./recruiter-filter.css";
import { MOCK_RECRUITERS, RECRUITER_COLORS } from "./recruiter-filter.constants";
import type { RecruiterFilterProps } from "./recruiter-filter.types";
import { getInitials } from "@/utils/user";

const RecruiterFilter = ({}: RecruiterFilterProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const filtered = useMemo(
    () =>
      MOCK_RECRUITERS.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const selected = MOCK_RECRUITERS.filter((r) => selectedIds.has(r.id));
  const displayAvatars = selected.slice(0, 4);
  const overflowCount = selected.length - 4;

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearAll = () => {
    setSelectedIds(new Set());
    setSearch("");
  };

  const selectAll = () => {
    setSelectedIds(new Set(filtered.map((r) => r.id)));
  };

  return (
    <div className="recruiter-filter-row">
      <div className="recruiter-filter-left">
        <span className="recruiter-filter-label">FILTER BY RECRUITER:</span>
        <div className="recruiter-popover-wrapper">
          <button
            ref={triggerRef}
            className={`recruiter-pill ${isOpen ? "recruiter-pill--open" : ""}`}
            onClick={() => setIsOpen((p) => !p)}
          >
            <div className="recruiter-avatar-stack">
              {displayAvatars.length > 0 ? (
                displayAvatars.map((r, i) => (
                  <div
                    key={r.id}
                    className="recruiter-avatar recruiter-avatar--active"
                    style={{
                      borderColor: RECRUITER_COLORS[i % RECRUITER_COLORS.length],
                      zIndex: displayAvatars.length - i,
                    }}
                    title={r.name}
                  >
                    {getInitials(r.name)}
                  </div>
                ))
              ) : (
                <div className="recruiter-avatar recruiter-avatar--empty">
                  <i className="bx bx-user" />
                </div>
              )}
              {overflowCount > 0 && (
                <div className="recruiter-avatar recruiter-avatar--overflow">
                  +{overflowCount}
                </div>
              )}
            </div>

            <span className="recruiter-count-badge">{selectedIds.size}</span>

            <svg
              className={`recruiter-chevron ${isOpen ? "recruiter-chevron--open" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={popoverRef}
                className="recruiter-popover"
                initial={{ opacity: 0, y: -4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <div className="recruiter-popover-header">
                  <i className="bx bx-search" />
                  <input
                    className="recruiter-search-input"
                    placeholder="Search recruiters..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="recruiter-popover-list">
                  {filtered.map((r) => {
                    const checked = selectedIds.has(r.id);
                    return (
                      <div
                        key={r.id}
                        className="recruiter-option"
                        onClick={() => toggle(r.id)}
                      >
                        <div
                          className={`recruiter-option-checkbox ${checked ? "recruiter-option-checkbox--checked" : ""}`}
                        >
                          {checked && <i className="bx bx-check" />}
                        </div>
                        <div className="recruiter-option-info">
                          <span className="recruiter-option-name">{r.name}</span>
                          <span className="recruiter-option-count">{r.count} candidates</span>
                        </div>
                      </div>
                    );
                  })}
                  {filtered.length === 0 && (
                    <div className="recruiter-empty-state">No recruiters found</div>
                  )}
                </div>

                <div className="recruiter-popover-footer">
                  <button className="recruiter-footer-btn recruiter-footer-btn--clear" onClick={clearAll}>
                    Clear Filters
                  </button>
                  <button className="recruiter-footer-btn recruiter-footer-btn--select-all" onClick={selectAll}>
                    Select All
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="recruiter-view-toggle-placeholder" />
    </div>
  );
};

export default RecruiterFilter;
