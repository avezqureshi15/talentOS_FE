import { useQuery } from "@tanstack/react-query";
import { fetchApplications } from "@/services/applications/applications";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";

export const useApplications = (jobId: string | undefined | null, status?: string, enabled?: boolean) => {
  return useQuery({
    queryKey: [QUERY_KEYS.APPLICATIONS, jobId, status ?? "all"],
    queryFn: () => fetchApplications(jobId ?? undefined, status),
    enabled: (enabled ?? true) && !!jobId,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
  });
};
