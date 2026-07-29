import { useQuery } from "@tanstack/react-query";
import { getApp } from "@/app/superadmin/apps/services/apps.service";
import { APPS_QUERY_KEYS } from "@/app/superadmin/apps/apps.constants";
import type { ApiKeyDetailResponse } from "@/app/superadmin/apps/services/apps.service.types";

export const useAppDetail = (appId: number | null) => {
  return useQuery<ApiKeyDetailResponse>({
    queryKey: [APPS_QUERY_KEYS.APP_DETAIL, appId],
    queryFn: async () => {
      const { data } = await getApp(appId!);
      return data;
    },
    enabled: appId !== null,
  });
};
