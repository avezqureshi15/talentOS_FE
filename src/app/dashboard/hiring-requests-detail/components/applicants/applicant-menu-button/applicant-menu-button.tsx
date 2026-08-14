import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import type { MenuAction } from "../applicants.types";
import type { ApplicantMenuButtonProps } from "./applicant-menu-button.types";
import "./applicant-menu-button.css";

const MENU_ITEMS: Record<MenuAction, { label: string; icon: string; className?: string }> = {
  select: {
    label: "Select",
    icon: "bx-user-check",
    className: "amb-item--select",
  },
  reject: {
    label: "Reject",
    icon: "bx-x-circle",
    className: "amb-item--reject",
  },
  hold: {
    label: "Hold",
    icon: "bx-pause-circle",
  },
};

const MENU_OFFSET_PX = 4;

const ApplicantMenuButton = ({
  menuActions,
  onMenuAction,
  id,
  onViewProfile,
  className,
  onBeforeOpen,
}: ApplicantMenuButtonProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        menuRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setMenuOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const handleScroll = () => setMenuOpen(false);
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [menuOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!menuOpen && triggerRef.current) {
      setAnchor(triggerRef.current.getBoundingClientRect());
      onBeforeOpen?.();
    }
    setMenuOpen((v) => !v);
  };

  const closeAnd = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    fn();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`three-dots-btn amb-trigger${className ? ` ${className}` : ""}`}
        onClick={handleToggle}
        aria-label="More actions"
        aria-expanded={menuOpen}
      >
        <i className="bx bx-dots-vertical-rounded" />
      </button>

      {menuOpen && anchor &&
        createPortal(
          <div
            ref={menuRef}
            className="amb-menu"
            style={{ top: anchor.bottom + MENU_OFFSET_PX, left: anchor.right }}
            onClick={(e) => e.stopPropagation()}
          >
            {menuActions.map((action) => {
              const meta = MENU_ITEMS[action];
              return (
                <button
                  key={action}
                  type="button"
                  className={`menu-item amb-item${meta.className ? ` ${meta.className}` : ""}`}
                  onClick={closeAnd(() => onMenuAction(action, id))}
                >
                  <i className={`bx ${meta.icon}`} />
                  {meta.label}
                </button>
              );
            })}
            {onViewProfile && (
              <button
                type="button"
                className="menu-item amb-item"
                onClick={closeAnd(onViewProfile)}
              >
                <i className="bx bx-user" /> View Profile
              </button>
            )}
          </div>,
          document.body,
        )}
    </>
  );
};

export default ApplicantMenuButton;
