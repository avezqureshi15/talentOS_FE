import httpClient from "@/services/http-client";
import type {
  ApiKeyListResponse,
  ApiKeyCreatedResponse,
  ApiKeyDetailResponse,
  ApiKeyResponse,
  CreateAppRequest,
  UpdateAppRequest,
  UpdatePermissionsRequest,
} from "./apps.service.types";

export const listApps = (params: { page?: number; per_page?: number; q?: string }) =>
  httpClient.get<ApiKeyListResponse>("/superadmin/apps", { params });

export const getApp = (appId: number) =>
  httpClient.get<ApiKeyDetailResponse>(`/superadmin/apps/${appId}`);

export const createApp = (body: CreateAppRequest) =>
  httpClient.post<ApiKeyCreatedResponse>("/superadmin/apps", body);

export const updateApp = (appId: number, body: UpdateAppRequest) =>
  httpClient.patch<ApiKeyResponse>(`/superadmin/apps/${appId}`, body);

export const revokeApp = (appId: number) =>
  httpClient.delete<{ message: string }>(`/superadmin/apps/${appId}`);

export const rotateKey = (appId: number) =>
  httpClient.post<ApiKeyCreatedResponse>(`/superadmin/apps/${appId}/rotate`);

export const updateAppPermissions = (appId: number, body: UpdatePermissionsRequest) =>
  httpClient.put<ApiKeyDetailResponse>(`/superadmin/apps/${appId}/permissions`, body);
