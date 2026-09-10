import { useQueries } from "@tanstack/react-query";
import { fetchInterviews } from "@/services/interviews/interviews";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";

export function useInterviewCount(hiringRequestId: string | undefined) {
  const results = useQueries({
    queries: [
      {
        queryKey: [QUERY_KEYS.INTERVIEWS, "incoming-count", hiringRequestId],
        queryFn: () => fetchInterviews("incoming", 1, 1, undefined, undefined, hiringRequestId),
        enabled: !!hiringRequestId,
        staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
        retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
      },
      {
        queryKey: [QUERY_KEYS.INTERVIEWS, "cancelled-count", hiringRequestId],
        queryFn: () => fetchInterviews("cancelled", 1, 1, undefined, undefined, hiringRequestId),
        enabled: !!hiringRequestId,
        staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
        retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
      },
    ],
  });

  const incomingTotal = results[0].data?.data.pagination.total_records ?? 0;
  const cancelledTotal = results[1].data?.data.pagination.total_records ?? 0;

  return incomingTotal + cancelledTotal;
}
