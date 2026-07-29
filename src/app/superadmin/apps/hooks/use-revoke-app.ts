import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revokeApp } from "@/app/superadmin/apps/services/apps.service";
import { APPS_QUERY_KEYS } from "@/app/superadmin/apps/apps.constants";

export const useRevokeApp = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (appId) => {
      await revokeApp(appId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPS_QUERY_KEYS.APPS_LIST] });
    },
  });
};
