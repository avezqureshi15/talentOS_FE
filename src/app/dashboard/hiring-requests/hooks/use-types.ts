import { useQuery } from "@tanstack/react-query";
import { fetchTypes } from "@/services/hiring-requests/hiring-requests";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";

export const useTypes = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.TYPES],
    queryFn: fetchTypes,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
  });
};
