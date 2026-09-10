import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import { fetchAiInterviews } from "@/services/ai/ai";

export function useAiInterviews(hiringRequestId: string | undefined, candidateId: number | undefined) {
  return useQuery({
    queryKey: [QUERY_KEYS.AI_INTERVIEWS, hiringRequestId, candidateId],
    queryFn: () => fetchAiInterviews(hiringRequestId!, candidateId!),
    enabled: !!hiringRequestId && !!candidateId,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
  });
}
