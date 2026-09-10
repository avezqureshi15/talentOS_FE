import { create } from "zustand";
import type { Toast, ToastType } from "@/components/ui/toast/toast.types";
import { TOAST_DURATION } from "@/components/ui/toast/toast.constants";

type ToastStore = {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number, title?: string) => string;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
};

let nextId = 1;

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  addToast: (message, type, duration = TOAST_DURATION, title) => {
    const id = `toast_${nextId++}`;
    const toast: Toast = { id, message, type, duration, title };
    set((state) => ({ toasts: [...state.toasts, toast] }));

    if (duration > 0) {
      setTimeout(() => get().dismissToast(id), duration);
    }

    return id;
  },

  dismissToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  clearToasts: () => set({ toasts: [] }),
}));
