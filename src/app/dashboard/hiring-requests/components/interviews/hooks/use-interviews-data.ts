import { useCallback, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchInterviews } from "@/services/interviews/interviews";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import { PAGINATION } from "@/constants/api-endpoints";
import type { InterviewEntity, InterviewSubTab } from "../interviews.types";
import type { InterviewApiItem } from "@/services/interviews/interviews.types";

type UseInterviewsResult = {
  interviews: InterviewEntity[];
  total: number;
  hasMore: boolean;
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  refresh: () => void;
};

const PER_PAGE = PAGINATION.INTERVIEWS_PER_PAGE;

export function useInterviewsData(
  subTab: InterviewSubTab,
): UseInterviewsResult {
  const [page, setPage] = useState(1);

  const statusFilter = subTab === "completed" ? "completed" : "incoming";

  const query = useQuery({
    queryKey: [QUERY_KEYS.INTERVIEWS, statusFilter, page],
    queryFn: () => fetchInterviews(statusFilter, page, PER_PAGE),
    placeholderData: keepPreviousData,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
  });

  const interviews = useMemo<InterviewEntity[]>(
    () => (query.data?.data.interviews ?? []).map(mapInterviewItem),
    [query.data],
  );

  const total = query.data?.data.pagination.total_records ?? 0;
  const hasMore = query.data?.data.pagination.has_more ?? false;

  return {
    interviews,
    total,
    hasMore,
    isLoading: query.isLoading,
    page,
    setPage: useCallback((p: number) => setPage(p), []),
    refresh: query.refetch,
  };
}

function mapInterviewItem(item: InterviewApiItem): InterviewEntity {
  const start = new Date(item.schedule.start_time);
  const end = new Date(item.schedule.end_time);
  const now = new Date();
  const isToday =
    start.toDateString() === now.toDateString();
  const isTomorrow =
    start.toDateString() ===
    new Date(now.getTime() + 86400000).toDateString();

  const fmtTime = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  return {
    id: item.id,
    interviewerName: item.interviewer.name,
    candidateName: item.candidate.name ?? item.candidate.email ?? "Unknown",
    candidateId: item.candidate.id,
    hiringRequestId: item.position.id,
    position: item.position.title,
    slotTime: `${fmtTime(start)} - ${fmtTime(end)}`,
    slotDate: isToday ? "Today" : isTomorrow ? "Tomorrow" : start.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    roomLink: item.meeting.url ?? "",
  };
}
