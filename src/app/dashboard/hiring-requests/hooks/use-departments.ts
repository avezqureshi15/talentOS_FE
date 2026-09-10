import { useQuery } from "@tanstack/react-query";
import { fetchDepartments } from "@/services/hiring-requests/hiring-requests";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";

export const useDepartments = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.DEPARTMENTS],
    queryFn: fetchDepartments,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
  });
};
