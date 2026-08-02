import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchApiKeys,
  updateApiKeys,
  type ApiKeyUpdate,
} from "../services/api-keys.service";
import { API_KEYS_QUERY_KEYS } from "../api-keys.constants";
import { QUERY_CONFIG } from "@/constants/constants";

export const useApiKeys = (tenantId: number | undefined) =>
  useQuery({
    queryKey: [API_KEYS_QUERY_KEYS.LIST, tenantId],
    queryFn: async () => (await fetchApiKeys(tenantId!)).data,
    enabled: !!tenantId,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
  });

export const useUpdateApiKeys = (tenantId: number | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (keys: ApiKeyUpdate[]) => (await updateApiKeys(tenantId!, keys)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_KEYS_QUERY_KEYS.LIST, tenantId] });
    },
  });
};
