import { useCallback, useEffect, useState } from "react";
import { ToastType } from "@/components/ui/toast/toast.types";
import { TOAST_ICONS, TOAST_ANIMATION_MS } from "@/components/ui/toast/toast.constants";
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
  const [exiting, setExiting] = useState(false);

  const handleDismiss = useCallback(() => {
    setExiting(true);
  }, []);

  useEffect(() => {
    if (!exiting) return;
    const timer = setTimeout(() => onDismiss(id), TOAST_ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [exiting, id, onDismiss]);

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
    <div className={`toast ${typeClass}${exiting ? " toast--exiting" : ""}`} role="alert">
      <i className={`${TOAST_ICONS[type]} toast__icon`} />
      <div className="toast__body">
        {title && <div className="toast__title">{title}</div>}
        <div className="toast__message">{message}</div>
      </div>
      <button className="toast__close" onClick={handleDismiss} aria-label="Dismiss">
        <i className="bx bx-x" />
      </button>
    </div>
  );
}
