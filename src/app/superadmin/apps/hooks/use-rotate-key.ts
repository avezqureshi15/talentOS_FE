import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rotateKey } from "@/app/superadmin/apps/services/apps.service";
import { APPS_QUERY_KEYS } from "@/app/superadmin/apps/apps.constants";
import type { ApiKeyCreatedResponse } from "@/app/superadmin/apps/services/apps.service.types";

export const useRotateKey = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiKeyCreatedResponse, Error, number>({
    mutationFn: async (appId) => {
      const { data } = await rotateKey(appId);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPS_QUERY_KEYS.APPS_LIST] });
    },
  });
};
