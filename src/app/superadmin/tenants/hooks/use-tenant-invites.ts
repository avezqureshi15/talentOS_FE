import { useQuery } from "@tanstack/react-query";
import { getInvites } from "@/app/admin/users/services/users-admin.service";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import type { Invite } from "@/app/admin/users/services/users-admin.service";

export const useTenantInvites = (tenantId: number, page: number) => {
  return useQuery<{ data: Invite[]; total: number }>({
    queryKey: [QUERY_KEYS.TENANT_INVITES, tenantId, page],
    queryFn: async () => {
      const { data } = await getInvites({ page, per_page: 20, tenant_id: tenantId });
      return data;
    },
    enabled: !!tenantId,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
  });
};
