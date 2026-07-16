import { fetchInterviews } from "./interviews";
import type { CommandItem } from "@/components/shared/mentions/types";

export type InterviewMentionsFetcherResult = {
  items: CommandItem[];
  hasMore: boolean;
};

function formatSchedule(startTime: string): { label: string; status: string } {
  const date = new Date(startTime);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const isToday = date.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const prefix = isToday ? "Today" : isTomorrow ? "Tomorrow" : isYesterday ? "Yesterday" : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const status = diff < 0 ? "completed" : "upcoming";
  return { label: `${prefix}, ${timeStr}`, status };
}

export const fetchInterviewsForMentions = async (
  query: string,
  page: number,
  candidateId?: string,
): Promise<InterviewMentionsFetcherResult> => {
  const perPage = 20;
  const res = await fetchInterviews(undefined, page, perPage, query || undefined, candidateId);

  const items: CommandItem[] = res.data.interviews.map((iv) => {
    const candidateName = iv.candidate?.name ?? iv.candidate?.email ?? "Unknown";
    const scheduleInfo = iv.schedule?.start_time
      ? formatSchedule(iv.schedule.start_time)
      : { label: "No schedule", status: "upcoming" };

    return {
      id: iv.id,
      label: `${iv.round_name} - ${candidateName}`,
      description: `${scheduleInfo.label} · ${iv.interviewer?.name ?? "Unknown"}`,
      relationalId: iv.id,
      meta: { status: scheduleInfo.status },
    };
  });

  const hasMore = res.data.pagination?.has_more ?? false;
  return { items, hasMore };
};
