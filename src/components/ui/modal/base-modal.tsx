import { useEffect } from "react";
import "./base-modal.css";
import type { BaseModalProps } from "./base-modal.types";

export default function BaseModal({
  open,
  onClose,
  title,
  icon,
  children,
  variant = "centered",
  className = "",
}: BaseModalProps) {

  // Explanation: closes the modal when the Escape key is pressed
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Explanation: prevents background scrolling while the modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  return (
    <div className={`base-overlay ${variant}`} onClick={onClose}>
      <div className={`base-modal ${variant} ${className}`} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="base-header">
            <div className="base-title">
              {icon && <i className={`bx ${icon}`}></i>}
              <span>{title}</span>
            </div>
            <button className="base-close" onClick={onClose} aria-label="Close modal">
              <i className="bx bx-x"></i>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
