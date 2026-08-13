import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteApp, type AppsScope } from "@/app/superadmin/apps/services/apps.service";
import { APPS_QUERY_KEYS } from "@/app/superadmin/apps/apps.constants";

export const useDeleteApp = (scope: AppsScope = "superadmin") => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (appId) => {
      await deleteApp(appId, scope);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPS_QUERY_KEYS.APPS_LIST] });
      queryClient.invalidateQueries({ queryKey: [APPS_QUERY_KEYS.APP_DETAIL] });
    },
  });
};