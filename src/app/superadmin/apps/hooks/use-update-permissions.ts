import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAppPermissions, type AppsScope } from "@/app/superadmin/apps/services/apps.service";
import { APPS_QUERY_KEYS } from "@/app/superadmin/apps/apps.constants";
import type {
  UpdatePermissionsRequest,
  ApiKeyDetailResponse,
} from "@/app/superadmin/apps/services/apps.service.types";

export const useUpdatePermissions = (scope: AppsScope = "superadmin") => {
  const queryClient = useQueryClient();

  return useMutation<ApiKeyDetailResponse, Error, { appId: number; body: UpdatePermissionsRequest }>({
    mutationFn: async ({ appId, body }) => {
      const { data } = await updateAppPermissions(appId, body, scope);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [APPS_QUERY_KEYS.APPS_LIST] });
      queryClient.invalidateQueries({ queryKey: [APPS_QUERY_KEYS.APP_DETAIL, variables.appId] });
    },
  });
};
