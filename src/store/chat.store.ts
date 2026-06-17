import { create } from "zustand";
import type { Message } from "../app/chat/pages/chat.type";

const STORAGE_KEY = "talentos_conversations";

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
};

type ChatState = {
  messages: Message[];
  hasStarted: boolean;
  threadId: string | null;
  isStreaming: boolean;
  conversations: Conversation[];

  addMessage: (msg: Message) => void;
  updateMessage: (id: number, updater: (msg: Message) => Message) => void;
  setStarted: () => void;
  setThreadId: (threadId: string) => void;
  setStreaming: (isStreaming: boolean) => void;
  startNewChat: () => void;
  switchConversation: (id: string) => void;
  saveConversation: () => void;
  reset: () => void;
};

const createThreadId = () => crypto.randomUUID();

const loadConversations = (): Conversation[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Conversation[];
    return Array.isArray(parsed)
      ? parsed.sort((a, b) => b.updatedAt - a.updatedAt)
      : [];
  } catch {
    return [];
  }
};

const getConversationTitle = (messages: Message[]): string => {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "New chat";

  for (const block of firstUser.content) {
    if (block.type === "text") {
      const text = block.text.trim();
      if (text) return text.length > 48 ? `${text.slice(0, 48)}…` : text;
    }
  }

  return "New chat";
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  hasStarted: false,
  threadId: null,
  isStreaming: false,
  conversations: loadConversations(),

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  updateMessage: (id, updater) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? updater(m) : m
      ),
    })),

  setStarted: () => set({ hasStarted: true }),

  setThreadId: (threadId) => set({ threadId }),

  setStreaming: (isStreaming) => set({ isStreaming }),

  startNewChat: () =>
    set({
      messages: [],
      threadId: null,
      hasStarted: true,
      isStreaming: false,
    }),

  switchConversation: (id) => {
    const conv = get().conversations.find((c) => c.id === id);
    if (!conv) return;

    set({
      messages: conv.messages,
      threadId: conv.id,
      hasStarted: true,
      isStreaming: false,
    });
  },

  saveConversation: () => {
    const { threadId, messages } = get();
    if (!threadId || messages.length === 0) return;

    const entry: Conversation = {
      id: threadId,
      title: getConversationTitle(messages),
      messages,
      updatedAt: Date.now(),
    };

    const conversations = [
      entry,
      ...get().conversations.filter((c) => c.id !== threadId),
    ].sort((a, b) => b.updatedAt - a.updatedAt);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    set({ conversations });
  },

  reset: () =>
    set({
      messages: [],
      hasStarted: false,
      threadId: createThreadId(),
      isStreaming: false,
    }),
}));
