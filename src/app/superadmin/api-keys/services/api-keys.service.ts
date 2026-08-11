import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export type ApiKeyScope = "platform" | "tenant";

export type ApiKeyEntry = {
  key: string;
  value: string;
  hasOverride: boolean;
  source: "tenant" | "platform";
  scope: ApiKeyScope;
  isSecret: boolean;
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
  scope: ApiKeyScope;
  is_secret: boolean;
};

export type ManageableApiKeysResponse = {
  keys: ManageableApiKeyMeta[];
};

export const fetchManageableApiKeys = () =>
  httpClient.get<ManageableApiKeysResponse>(API_ENDPOINTS.SETTINGS_API_KEYS_MANAGEABLE);

export const fetchApiKeys = (tenantId?: number) =>
  httpClient.get<ApiKeysResponse>(API_ENDPOINTS.SETTINGS_API_KEYS, {
    params: tenantId !== undefined ? { tenant_id: tenantId } : undefined,
  });

export const updateApiKeys = (tenantId: number | undefined, keys: ApiKeyUpdate[]) =>
  httpClient.patch<ApiKeysResponse>(API_ENDPOINTS.SETTINGS_API_KEYS, {
    ...(tenantId !== undefined ? { tenant_id: tenantId } : {}),
    keys,
  });