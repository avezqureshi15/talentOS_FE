import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import { fetchAiScreeningResult } from "@/services/ai/ai";

export function useAiScreeningResult(hiringRequestId: string | undefined, candidateId: number | undefined) {
  return useQuery({
    queryKey: [QUERY_KEYS.AI_SCREENING, hiringRequestId, candidateId],
    queryFn: () => fetchAiScreeningResult(hiringRequestId!, candidateId!),
    enabled: !!hiringRequestId && !!candidateId,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
  });
}
