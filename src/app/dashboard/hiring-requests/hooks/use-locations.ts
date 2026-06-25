import { useQuery } from "@tanstack/react-query";
import { fetchLocations } from "@/services/hiring-requests/hiring-requests";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";

export const useLocations = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.LOCATIONS],
    queryFn: fetchLocations,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
  });
};
