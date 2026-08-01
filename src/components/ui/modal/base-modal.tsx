import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./base-modal.css";
import type { BaseModalProps } from "./base-modal.types";
import { springWarm } from "@/utils/motion";

export default function BaseModal({
  open,
  onClose,
  title,
  icon,
  children,
  variant = "centered",
  className = "",
  overlayClassName = "",
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={`base-overlay ${variant} ${overlayClassName}`.trim()}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={`base-modal ${variant} ${className}`}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={springWarm}
          >
            {title && (
              <div className="base-header">
                <div className="base-title">
                  {icon && <i className={`bx ${icon}`}></i>}
                  <span>{title}</span>
                </div>
                <motion.button
                  className="base-close"
                  onClick={onClose}
                  aria-label="Close modal"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={springWarm}
                >
                  <i className="bx bx-x"></i>
                </motion.button>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
