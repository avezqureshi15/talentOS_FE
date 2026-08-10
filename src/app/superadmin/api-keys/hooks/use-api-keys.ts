import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchApiKeys,
  fetchManageableApiKeys,
  updateApiKeys,
  type ApiKeyUpdate,
} from "../services/api-keys.service";
import { API_KEYS_QUERY_KEYS } from "../api-keys.constants";
import { QUERY_CONFIG } from "@/constants/constants";

export const useApiKeys = (tenantId: number | undefined) =>
  useQuery({
    queryKey: [API_KEYS_QUERY_KEYS.LIST, tenantId],
    queryFn: async () => (await fetchApiKeys(tenantId)).data,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
  });

export const useManageableApiKeys = () =>
  useQuery({
    queryKey: [API_KEYS_QUERY_KEYS.MANAGEABLE],
    queryFn: async () => (await fetchManageableApiKeys()).data.keys,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
  });

export type UpdateApiKeysVariables = {
  tenantId: number | undefined;
  keys: ApiKeyUpdate[];
};

export const useUpdateApiKeys = (tenantId: number | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tenantId: saveTenantId, keys }: UpdateApiKeysVariables) =>
      (await updateApiKeys(saveTenantId, keys)).data,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [API_KEYS_QUERY_KEYS.LIST, variables.tenantId] });
      queryClient.invalidateQueries({ queryKey: [API_KEYS_QUERY_KEYS.LIST, tenantId] });
    },
  });
};