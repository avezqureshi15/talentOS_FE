import { useCallback, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchInterviews } from "@/services/interviews/interviews";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import { PAGINATION } from "@/constants/api-endpoints";
import type { InterviewApiItem } from "@/services/interviews/interviews.types";

export type InterviewRow = {
  id: string;
  roundName: string;
  interviewerName: string;
  interviewerEmpId: string;
  candidateName: string;
  candidateId: string;
  slotTime: string;
  slotDate: string;
  interviewStatus: string;
  cancelledAt: string | null;
};

type UseInterviewsByHrResult = {
  interviews: InterviewRow[];
  total: number;
  hasMore: boolean;
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  refresh: () => void;
};

const PER_PAGE = PAGINATION.INTERVIEWS_PER_PAGE;

export function useInterviewsByHr(
  hiringRequestId: string | undefined,
  subTab: "incoming" | "cancelled",
): UseInterviewsByHrResult {
  const [page, setPage] = useState(1);
  const statusFilter = subTab === "cancelled" ? "cancelled" : "incoming";

  const query = useQuery({
    queryKey: [QUERY_KEYS.INTERVIEWS, statusFilter, page, hiringRequestId],
    queryFn: () => fetchInterviews(statusFilter, page, PER_PAGE, undefined, undefined, hiringRequestId),
    placeholderData: keepPreviousData,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
    enabled: !!hiringRequestId,
  });

  const interviews = useMemo<InterviewRow[]>(
    () => (query.data?.data.interviews ?? []).map(mapRow),
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

function mapRow(item: InterviewApiItem): InterviewRow {
  const start = new Date(item.schedule.start_time);
  const end = new Date(item.schedule.end_time);

  const fmtTime = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  const fmtDate = (d: Date) => {
    const day = d.getDate();
    const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
    const month = d.toLocaleDateString("en-US", { month: "long" });
    return `${day}${suffix} ${month}`;
  };

  return {
    id: item.id,
    roundName: item.round_name,
    interviewerName: item.interviewer.name,
    interviewerEmpId: item.interviewer.id,
    candidateName: item.candidate.name ?? item.candidate.email ?? "Unknown",
    candidateId: item.candidate.id,
    slotTime: `${fmtTime(start)} - ${fmtTime(end)}`,
    slotDate: fmtDate(start),
    interviewStatus: item.interview_status,
    cancelledAt: item.cancelled_at ?? null,
  };
}
