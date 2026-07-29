import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createApp } from "@/app/superadmin/apps/services/apps.service";
import { APPS_QUERY_KEYS } from "@/app/superadmin/apps/apps.constants";
import type {
  CreateAppRequest,
  ApiKeyCreatedResponse,
} from "@/app/superadmin/apps/services/apps.service.types";

export const useCreateApp = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiKeyCreatedResponse, Error, CreateAppRequest>({
    mutationFn: async (body) => {
      const { data } = await createApp(body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPS_QUERY_KEYS.APPS_LIST] });
    },
  });
};
