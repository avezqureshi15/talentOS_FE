import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/app/admin/users/services/users-admin.service";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import type { AdminUser } from "@/app/admin/users/services/users-admin.service";

export const useTenantUsers = (tenantId: number, page: number, search: string) => {
  return useQuery<{ data: AdminUser[]; total: number }>({
    queryKey: [QUERY_KEYS.TENANT_USERS, tenantId, page, search],
    queryFn: async () => {
      const { data } = await getUsers({ page, per_page: 20, q: search || undefined, tenant_id: tenantId });
      return data;
    },
    enabled: !!tenantId,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
  });
};
