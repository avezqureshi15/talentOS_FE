import { useQueries } from "@tanstack/react-query";
import { fetchFinalVerdicts } from "@/services/applications/applications";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import { FINAL_VERDICT_SUB_TABS } from "../final-verdict.constants";
import type { FinalVerdictSubTab } from "../final-verdict.types";

export function useFinalVerdictCounts(jobId: string): Record<FinalVerdictSubTab, number> {
  const results = useQueries({
    queries: FINAL_VERDICT_SUB_TABS.map((tab) => ({
      queryKey: [QUERY_KEYS.FINAL_VERDICTS, "count", tab.apiStatus, jobId],
      queryFn: () => fetchFinalVerdicts(tab.apiStatus, 1, 0, jobId),
      staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
      retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
      refetchOnWindowFocus: false,
      select: (page: { total: number }) => page.total,
    })),
  });

  return {
    selected: results[0]?.data ?? 0,
    rejected: results[1]?.data ?? 0,
    "on-hold": results[2]?.data ?? 0,
  };
}
