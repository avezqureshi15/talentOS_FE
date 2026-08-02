import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { HeaderActionConfig } from "@/store/header.store";
import { BUTTON_LOADING_SPINNER_CLASS } from "@/components/ui/button/button.constants";
import { springSoft } from "@/utils/motion";

type HeaderMoreMenuProps = {
  actions: HeaderActionConfig[];
};

const HeaderMoreMenu = ({ actions }: HeaderMoreMenuProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div className="header-more-wrapper" ref={wrapperRef}>
      <button
        type="button"
        className={`jobs-more-btn${open ? " jobs-more-btn--active" : ""}`}
        onClick={() => setOpen((v) => !v)}
        title="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <i className="bx bx-dots-horizontal-rounded" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="header-more-menu"
            role="menu"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={springSoft}
          >
            {actions.map((action) => {
              const [title, ...descLines] = action.tooltipLines ?? [];
              const titleLabel = title ?? action.label;
              const description = descLines.join(" ");
              return (
                <button
                  key={action.key}
                  type="button"
                  className="header-more-item"
                  role="menuitem"
                  disabled={action.disabled || action.loading}
                  onClick={() => {
                    if (action.disabled || action.loading) return;
                    action.onClick?.();
                    setOpen(false);
                  }}
                >
                  {action.loading ? (
                    <i className={BUTTON_LOADING_SPINNER_CLASS} />
                  ) : (
                    action.icon && <i className={action.icon} />
                  )}
                  <span className="header-more-item-text">
                    <span className="header-more-item-title">
                      {action.loading ? action.loadingText ?? titleLabel : titleLabel}
                    </span>
                    {!action.loading && description && (
                      <span className="header-more-item-desc">{description}</span>
                    )}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeaderMoreMenu;
