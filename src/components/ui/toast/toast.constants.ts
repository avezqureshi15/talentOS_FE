import { ToastType } from "@/components/ui/toast/toast.types";

export const TOAST_DURATION = 4000;
export const TOAST_ANIMATION_MS = 400;

export const TOAST_ICONS: Record<ToastType, string> = {
  [ToastType.SUCCESS]: "bx bx-check-circle",
  [ToastType.ERROR]: "bx bx-error-circle",
  [ToastType.WARNING]: "bx bx-error",
  [ToastType.INFO]: "bx bx-info-circle",
};
