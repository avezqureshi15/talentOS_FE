import { useCallback } from "react";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";

export function useToast() {
  const addToast = useToastStore((s) => s.addToast);
  const dismissToast = useToastStore((s) => s.dismissToast);
  const clearToasts = useToastStore((s) => s.clearToasts);

  const success = useCallback(
    (message: string, title?: string, duration?: number) =>
      addToast(message, ToastType.SUCCESS, duration, title),
    [addToast],
  );

  const error = useCallback(
    (message: string, title?: string, duration?: number) =>
      addToast(message, ToastType.ERROR, duration, title),
    [addToast],
  );

  const warning = useCallback(
    (message: string, title?: string, duration?: number) =>
      addToast(message, ToastType.WARNING, duration, title),
    [addToast],
  );

  const info = useCallback(
    (message: string, title?: string, duration?: number) =>
      addToast(message, ToastType.INFO, duration, title),
    [addToast],
  );

  return { success, error, warning, info, dismissToast, clearToasts };
}
