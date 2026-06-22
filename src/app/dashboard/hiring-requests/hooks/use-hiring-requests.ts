import { useQuery } from "@tanstack/react-query";
import {
  fetchHiringRequests,
  fetchHiringRequestById,
} from "@/services/hiring-requests/hiring-requests";
import type { HiringRequestsFilters } from "@/services/hiring-requests/hiring-requests.types";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";

export const useHiringRequests = (filters?: HiringRequestsFilters) => {
  return useQuery({
    queryKey: [QUERY_KEYS.HIRING_REQUESTS, filters],
    queryFn: () => fetchHiringRequests(filters),
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
