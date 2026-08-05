import { useQuery } from "@tanstack/react-query";
import { listApps, type AppsScope } from "@/app/superadmin/apps/services/apps.service";
import { APPS_QUERY_KEYS } from "@/app/superadmin/apps/apps.constants";
import type { AppListResponse } from "@/app/superadmin/apps/services/apps.service.types";

export const useAppsList = (
  page: number,
  search: string,
  tenantId?: number | null,
  scope: AppsScope = "superadmin",
) => {
  return useQuery<AppListResponse>({
    queryKey: [APPS_QUERY_KEYS.APPS_LIST, scope, tenantId ?? "all", page, search],
    queryFn: async () => {
      const { data } = await listApps(
        {
          page,
          per_page: 20,
          q: search || undefined,
          tenant_id: tenantId ?? undefined,
        },
        scope,
      );
      return data;
    },
  });
};
