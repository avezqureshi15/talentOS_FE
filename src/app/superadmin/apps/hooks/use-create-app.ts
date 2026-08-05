import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createApp, type AppsScope } from "@/app/superadmin/apps/services/apps.service";
import { APPS_QUERY_KEYS } from "@/app/superadmin/apps/apps.constants";
import type {
  CreateAppRequest,
  AppCreatedResponse,
} from "@/app/superadmin/apps/services/apps.service.types";

export const useCreateApp = (scope: AppsScope = "superadmin") => {
  const queryClient = useQueryClient();

  return useMutation<AppCreatedResponse, Error, CreateAppRequest>({
    mutationFn: async (body) => {
      const { data } = await createApp(body, scope);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPS_QUERY_KEYS.APPS_LIST] });
    },
  });
};
