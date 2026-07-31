import { useQuery } from "@tanstack/react-query";
import { getApp, type AppsScope } from "@/app/superadmin/apps/services/apps.service";
import { APPS_QUERY_KEYS } from "@/app/superadmin/apps/apps.constants";
import type { ApiKeyDetailResponse } from "@/app/superadmin/apps/services/apps.service.types";

export const useAppDetail = (appId: number | null, scope: AppsScope = "superadmin") => {
  return useQuery<ApiKeyDetailResponse>({
    queryKey: [APPS_QUERY_KEYS.APP_DETAIL, scope, appId],
    queryFn: async () => {
      const { data } = await getApp(appId!, scope);
      return data;
    },
    enabled: appId !== null,
  });
};
