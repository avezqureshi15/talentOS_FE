import { fetchAlerts } from "./alerts";
import type { CommandItem } from "@/components/shared/mentions/types";

export type AlertMentionsFetcherResult = {
  items: CommandItem[];
  hasMore: boolean;
};

function formatTime(createdAt: string | null): string {
  if (!createdAt) return "";
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

export const fetchAlertsForMentions = async (
  query: string,
  page: number,
): Promise<AlertMentionsFetcherResult> => {
  const perPage = 20;
  const res = await fetchAlerts(undefined, page, perPage, false, query || undefined);

  const items: CommandItem[] = res.data.alerts.map((alert) => {
    const interview = alert.interview;
    const candidateName = interview?.candidate_name ?? "";
    const position = interview?.position ?? "";
    const label = candidateName && position
      ? `${candidateName} - ${position}`
      : `${alert.type} - ${alert.employee.name}`;

    const description = `${alert.employee.name} · ${formatTime(alert.created_at)}`;

    return {
      id: alert.id,
      label,
      description,
      relationalId: alert.id,
      meta: { type: alert.type, employee_id: String(alert.employee_id) },
    };
  });

  const hasMore = res.data.pagination?.has_more ?? false;
  return { items, hasMore };
};
