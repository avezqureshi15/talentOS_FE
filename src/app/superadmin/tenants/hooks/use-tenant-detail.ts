import { useQuery } from "@tanstack/react-query";
import { getTenant } from "../services/tenants.service";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";

export const useTenantDetail = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TENANT, id],
    queryFn: async () => {
      const { data } = await getTenant(id);
      return data;
    },
    enabled: !!id,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
  });
};
