import { useQuery } from "@tanstack/react-query";
import { fetchApplications } from "@/services/applications/applications";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";

export const useApplications = (jobId: string | undefined | null, enabled?: boolean) => {
  return useQuery({
    queryKey: [QUERY_KEYS.APPLICATIONS],
    queryFn: fetchApplications,
    enabled: enabled ?? true,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    select: (data) =>
      jobId ? data.filter((app) => app.job_id === jobId) : [],
  });
};
