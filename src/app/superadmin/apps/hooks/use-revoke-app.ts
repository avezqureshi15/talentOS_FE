import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revokeApp, type AppsScope } from "@/app/superadmin/apps/services/apps.service";
import { APPS_QUERY_KEYS } from "@/app/superadmin/apps/apps.constants";

export const useRevokeApp = (scope: AppsScope = "superadmin") => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (appId) => {
      await revokeApp(appId, scope);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPS_QUERY_KEYS.APPS_LIST] });
    },
  });
};
