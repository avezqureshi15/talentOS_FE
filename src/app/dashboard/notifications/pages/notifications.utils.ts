import type { NotificationApiItem } from "@/services/notifications/notifications.types";

const IST = "Asia/Kolkata";

export function formatRelativeTime(createdAt: string): string {
  const then = new Date(createdAt).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - then);
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return formatFullTime(createdAt);
}

export function formatFullTime(createdAt: string): string {
  return new Date(createdAt).toLocaleString("en-IN", {
    timeZone: IST,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function istDayKey(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: IST });
}

export type NotificationGroup = {
  label: string;
  items: NotificationApiItem[];
};

export function groupNotifications(items: NotificationApiItem[]): NotificationGroup[] {
  const now = new Date();
  const nowKey = istDayKey(now.toISOString());
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = istDayKey(yesterday.toISOString());
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
  const weekStartKey = istDayKey(weekStart.toISOString());

  const buckets: NotificationGroup[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "Earlier this week", items: [] },
    { label: "Older", items: [] },
  ];

  for (const item of items) {
    const key = istDayKey(item.created_at);
    if (key === nowKey) buckets[0].items.push(item);
    else if (key === yesterdayKey) buckets[1].items.push(item);
    else if (key >= weekStartKey) buckets[2].items.push(item);
    else buckets[3].items.push(item);
  }

  return buckets.filter((b) => b.items.length > 0);
}
