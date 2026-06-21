import { create } from "zustand";
import type { Message } from "@/app/chat/pages/chat.types";

type ChatState = {
  messages: Message[];
  hasStarted: boolean;
  isProcessing: boolean;
  error: string | null;

  addMessage: (msg: Message) => void;
  updateMessage: (id: number, updater: (msg: Message) => Message) => void;
  setStarted: () => void;
  setProcessing: (v: boolean) => void;
  setError: (e: string | null) => void;
  reset: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  hasStarted: false,
  isProcessing: false,
  error: null,

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  updateMessage: (id, updater) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? updater(m) : m
      ),
    })),

  setStarted: () => set({ hasStarted: true }),

  setProcessing: (v) => set({ isProcessing: v }),

  setError: (e) => set({ error: e }),

  reset: () => set({ messages: [], hasStarted: false, isProcessing: false, error: null }),
}));