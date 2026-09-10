import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateApp, type AppsScope } from "@/app/superadmin/apps/services/apps.service";
import { APPS_QUERY_KEYS } from "@/app/superadmin/apps/apps.constants";
import type { AppResponse, UpdateAppRequest } from "@/app/superadmin/apps/services/apps.service.types";

export const useUpdateApp = (scope: AppsScope = "superadmin") => {
  const queryClient = useQueryClient();

  return useMutation<AppResponse, Error, { appId: number; body: UpdateAppRequest }>({
    mutationFn: async ({ appId, body }) => {
      const { data } = await updateApp(appId, body, scope);
      return data;
    },
    onSuccess: (_data, { appId }) => {
      queryClient.invalidateQueries({ queryKey: [APPS_QUERY_KEYS.APPS_LIST] });
      queryClient.invalidateQueries({ queryKey: [APPS_QUERY_KEYS.APP_DETAIL, appId] });
    },
  });
};
