import { useQuery } from "@tanstack/react-query";
import { AI_SCREENING_POLL_INTERVAL_MS, AI_SCREENING_TERMINAL_STATUSES, QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import { fetchAiScreeningResult } from "@/services/ai/ai";
import type { AiScreeningResult } from "@/services/ai/ai.types";

type UseAiScreeningOptions = {
  poll?: boolean;
  enabled?: boolean;
};

const shouldKeepPolling = (data: AiScreeningResult | undefined) => {
  if (!data) return true;
  const status = (data.call_status || "").toLowerCase();
  return !AI_SCREENING_TERMINAL_STATUSES.has(status);
};

export function useAiScreeningResult(
  hiringRequestId: string | undefined,
  candidateId: number | undefined,
  options: UseAiScreeningOptions = {},
) {
  return useQuery({
    queryKey: [QUERY_KEYS.AI_SCREENING, hiringRequestId, candidateId],
    queryFn: () => fetchAiScreeningResult(hiringRequestId!, candidateId!),
    enabled: (options.enabled ?? true) && !!hiringRequestId && !!candidateId,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
    refetchInterval: options.poll
      ? (query) => (shouldKeepPolling(query.state.data as AiScreeningResult | undefined) ? AI_SCREENING_POLL_INTERVAL_MS : false)
      : false,
  });
}
