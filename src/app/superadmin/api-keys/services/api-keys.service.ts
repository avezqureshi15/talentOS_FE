import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export type ApiKeyEntry = {
  key: string;
  value: string;
  hasOverride: boolean;
  source: "tenant" | "platform";
};

export type ApiKeysResponse = {
  keys: ApiKeyEntry[];
};

export type ApiKeyUpdate = {
  key: string;
  value: string;
};

export type ManageableApiKeyMeta = {
  key: string;
  label: string;
  icon: string;
  hint: string;
};

export type ManageableApiKeysResponse = {
  keys: ManageableApiKeyMeta[];
};

export const fetchManageableApiKeys = () =>
  httpClient.get<ManageableApiKeysResponse>(API_ENDPOINTS.SETTINGS_API_KEYS_MANAGEABLE);

export const fetchApiKeys = (tenantId: number) =>
  httpClient.get<ApiKeysResponse>(API_ENDPOINTS.SETTINGS_API_KEYS, {
    params: { tenant_id: tenantId },
  });

export const updateApiKeys = (tenantId: number, keys: ApiKeyUpdate[]) =>
  httpClient.patch<ApiKeysResponse>(API_ENDPOINTS.SETTINGS_API_KEYS, {
    tenant_id: tenantId,
    keys,
  });
