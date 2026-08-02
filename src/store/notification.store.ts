import { create } from "zustand";
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from "@/services/notifications/notifications";
import { queryClient } from "@/services/query-client";
import { QUERY_KEYS } from "@/constants/constants";
import type { NotificationApiItem } from "@/services/notifications/notifications.types";

const BASE_INTERVAL_MS = 15_000;
const MAX_INTERVAL_MS = 60_000;
const JITTER_MS = 2_000;
const LATEST_PER_PAGE = 10;

type NotificationState = {
  unreadCount: number;
  latest: NotificationApiItem[];
  isPolling: boolean;
  startPolling: () => void;
  stopPolling: () => void;
  refreshNow: () => Promise<void>;
  markRead: (notificationId: string) => Promise<void>;
  markAllRead: () => Promise<void>;
};

let timer: ReturnType<typeof setTimeout> | null = null;
let intervalMs = BASE_INTERVAL_MS;
let started = false;

function jitter(): number {
  return Math.floor(Math.random() * JITTER_MS);
}

function invalidateOnCountChange() {
  queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.APPLICATIONS] });
  queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HIRING_REQUEST] });
  queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INTERVIEWS] });
  queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FINAL_VERDICTS] });
}

async function tick(): Promise<void> {
  if (document.hidden) {
    schedule();
    return;
  }
  try {
    const res = await fetchNotifications({ page: 1, perPage: LATEST_PER_PAGE, isRead: false });
    const count = res.data.pagination.total_records;
    intervalMs = BASE_INTERVAL_MS;
    const prev = useNotificationStore.getState().unreadCount;
    useNotificationStore.setState({ unreadCount: count, latest: res.data.notifications });
    if (count !== prev) {
      invalidateOnCountChange();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    }
  } catch {
    intervalMs = Math.min(intervalMs * 2, MAX_INTERVAL_MS);
  }
  schedule();
}

function schedule(): void {
  if (!started) return;
  timer = setTimeout(() => {
    void tick();
  }, intervalMs + jitter());
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  unreadCount: 0,
  latest: [],
  isPolling: false,

  startPolling: () => {
    if (started) return;
    started = true;
    set({ isPolling: true });
    void tick();
  },

  stopPolling: () => {
    started = false;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    set({ isPolling: false });
  },

  refreshNow: async () => {
    if (document.hidden) return;
    try {
      const res = await fetchNotifications({ page: 1, perPage: LATEST_PER_PAGE, isRead: false });
      const count = res.data.pagination.total_records;
      intervalMs = BASE_INTERVAL_MS;
      const prev = get().unreadCount;
      set({ unreadCount: count, latest: res.data.notifications });
      if (count !== prev) {
        invalidateOnCountChange();
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
      }
    } catch {
      intervalMs = Math.min(intervalMs * 2, MAX_INTERVAL_MS);
    }
  },

  markRead: async (notificationId: string) => {
    const prevCount = get().unreadCount;
    set((state) => ({
      unreadCount: Math.max(0, state.unreadCount - 1),
      latest: state.latest.filter((n) => n.id !== notificationId),
    }));
    try {
      await markNotificationRead(notificationId);
      invalidateOnCountChange();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    } catch {
      set({ unreadCount: prevCount });
    }
  },

  markAllRead: async () => {
    const prevCount = get().unreadCount;
    set({ unreadCount: 0, latest: [] });
    try {
      await markAllNotificationsRead();
      invalidateOnCountChange();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    } catch {
      set({ unreadCount: prevCount });
    }
  },
}));
