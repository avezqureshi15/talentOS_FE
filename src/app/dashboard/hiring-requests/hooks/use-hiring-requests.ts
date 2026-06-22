import { useQuery } from "@tanstack/react-query";
import {
  fetchHiringRequests,
  fetchHiringRequestById,
} from "@/services/hiring-requests/hiring-requests";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";

export const useHiringRequests = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.HIRING_REQUESTS],
    queryFn: fetchHiringRequests,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
  });
};

export const useHiringRequest = (id: string | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEYS.HIRING_REQUEST, id],
    queryFn: () => fetchHiringRequestById(id!),
    enabled: !!id,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
  });
};
