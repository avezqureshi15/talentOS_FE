import { useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ToastType } from "@/components/ui/toast/toast.types";
import { TOAST_ICONS } from "@/components/ui/toast/toast.constants";
import { springWarm } from "@/utils/motion";
import "@/components/ui/toast/toast.css";

type ToastProps = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  title?: string;
  onDismiss: (id: string) => void;
};

export default function Toast({ id, message, type, duration, title, onDismiss }: ToastProps) {
  const handleDismiss = useCallback(() => {
    onDismiss(id);
  }, [id, onDismiss]);

  useEffect(() => {
    if (!duration || duration <= 0) return;
    const timer = setTimeout(() => handleDismiss(), duration);
    return () => clearTimeout(timer);
  }, [duration, handleDismiss]);

  const typeClass = {
    [ToastType.SUCCESS]: "toast--success",
    [ToastType.ERROR]: "toast--error",
    [ToastType.WARNING]: "toast--warning",
    [ToastType.INFO]: "toast--info",
  }[type];

  return (
    <motion.div
      className={`toast ${typeClass}`}
      role="alert"
      layout
      initial={{ opacity: 0, x: 30, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.96 }}
      transition={springWarm}
    >
      <i className={`${TOAST_ICONS[type]} toast__icon`} />
      <div className="toast__body">
        {title && <div className="toast__title">{title}</div>}
        <div className="toast__message">{message}</div>
      </div>
      <motion.button
        className="toast__close"
        onClick={handleDismiss}
        aria-label="Dismiss"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        transition={springWarm}
      >
        <i className="bx bx-x" />
      </motion.button>
    </motion.div>
  );
}
