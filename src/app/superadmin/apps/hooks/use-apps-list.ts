import { useQuery } from "@tanstack/react-query";
import { listApps } from "@/app/superadmin/apps/services/apps.service";
import { APPS_QUERY_KEYS } from "@/app/superadmin/apps/apps.constants";
import type { ApiKeyListResponse } from "@/app/superadmin/apps/services/apps.service.types";

export const useAppsList = (page: number, search: string) => {
  return useQuery<ApiKeyListResponse>({
    queryKey: [APPS_QUERY_KEYS.APPS_LIST, page, search],
    queryFn: async () => {
      const { data } = await listApps({
        page,
        per_page: 20,
        q: search || undefined,
      });
      return data;
    },
  });
};
