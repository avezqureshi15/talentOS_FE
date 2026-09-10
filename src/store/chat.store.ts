import { create } from "zustand";
import type { Message } from "@/app/chat/pages/chat.types";

type ChatState = {
  messages: Message[];
  hasStarted: boolean;
  isProcessing: boolean;
  error: string | null;
  chatId: string | null;
  hasMore: boolean;

  addMessage: (msg: Message) => void;
  updateMessage: (id: number, updater: (msg: Message) => Message) => void;
  setMessages: (msgs: Message[]) => void;
  prependMessages: (msgs: Message[]) => void;
  setStarted: () => void;
  setProcessing: (v: boolean) => void;
  setError: (e: string | null) => void;
  setChatId: (id: string | null) => void;
  setHasMore: (v: boolean) => void;
  reset: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  hasStarted: false,
  isProcessing: false,
  error: null,
  chatId: null,
  hasMore: false,

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  updateMessage: (id, updater) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? updater(m) : m
      ),
    })),

  setMessages: (msgs) => set({ messages: msgs }),

  prependMessages: (msgs) =>
    set((state) => ({ messages: [...msgs, ...state.messages] })),

  setStarted: () => set({ hasStarted: true }),

  setProcessing: (v) => set({ isProcessing: v }),

  setError: (e) => set({ error: e }),

  setChatId: (id) => set({ chatId: id }),

  setHasMore: (v) => set({ hasMore: v }),

  reset: () =>
    set({
      messages: [],
      hasStarted: false,
      isProcessing: false,
      error: null,
      chatId: null,
      hasMore: false,
    }),
}));
