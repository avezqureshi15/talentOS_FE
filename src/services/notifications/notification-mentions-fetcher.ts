import { fetchNotifications } from "./notifications";
import type { CommandItem } from "@/components/shared/mentions/types";

export type NotificationMentionsFetcherResult = {
  items: CommandItem[];
  hasMore: boolean;
};

function formatTime(createdAt: string): string {
  const date = new Date(createdAt);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  if (isToday) return `Today, ${timeStr}`;
  if (isYesterday) return `Yesterday, ${timeStr}`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const fetchNotificationsForMentions = async (
  query: string,
  page: number,
): Promise<NotificationMentionsFetcherResult> => {
  const perPage = 20;
  const res = await fetchNotifications({
    page,
    perPage,
    isRead: false,
    search: query || undefined,
  });

  const items: CommandItem[] = res.data.notifications.map((n) => ({
    id: n.id,
    label: n.title,
    description: `${formatTime(n.created_at)}${n.body ? ` · ${n.body}` : ""}`,
    relationalId: n.id,
    meta: { type: n.type, employee_id: String(n.employee_id) },
  }));

  const hasMore = res.data.pagination?.has_more ?? false;
  return { items, hasMore };
};
