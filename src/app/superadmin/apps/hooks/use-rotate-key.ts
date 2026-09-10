import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rotateKey, type AppsScope } from "@/app/superadmin/apps/services/apps.service";
import { APPS_QUERY_KEYS } from "@/app/superadmin/apps/apps.constants";
import type { AppCreatedResponse } from "@/app/superadmin/apps/services/apps.service.types";

export const useRotateKey = (scope: AppsScope = "superadmin") => {
  const queryClient = useQueryClient();

  return useMutation<AppCreatedResponse, Error, number>({
    mutationFn: async (appId) => {
      const { data } = await rotateKey(appId, scope);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPS_QUERY_KEYS.APPS_LIST] });
    },
  });
};
