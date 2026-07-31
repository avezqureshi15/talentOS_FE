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

export type AppsScope = "superadmin" | "admin";

const APPS_BASE: Record<AppsScope, string> = {
  superadmin: "/superadmin/apps",
  admin: "/admin/apps",
};

export const listApps = (
  params: { page?: number; per_page?: number; q?: string; tenant_id?: number },
  scope: AppsScope = "superadmin",
) => httpClient.get<ApiKeyListResponse>(APPS_BASE[scope], { params });

export const getApp = (appId: number, scope: AppsScope = "superadmin") =>
  httpClient.get<ApiKeyDetailResponse>(`${APPS_BASE[scope]}/${appId}`);

export const createApp = (body: CreateAppRequest, scope: AppsScope = "superadmin") =>
  httpClient.post<ApiKeyCreatedResponse>(APPS_BASE[scope], body);

export const updateApp = (appId: number, body: UpdateAppRequest, scope: AppsScope = "superadmin") =>
  httpClient.patch<ApiKeyResponse>(`${APPS_BASE[scope]}/${appId}`, body);

export const revokeApp = (appId: number, scope: AppsScope = "superadmin") =>
  httpClient.delete<{ message: string }>(`${APPS_BASE[scope]}/${appId}`);

export const rotateKey = (appId: number, scope: AppsScope = "superadmin") =>
  httpClient.post<ApiKeyCreatedResponse>(`${APPS_BASE[scope]}/${appId}/rotate`);

export const updateAppPermissions = (appId: number, body: UpdatePermissionsRequest, scope: AppsScope = "superadmin") =>
  httpClient.put<ApiKeyDetailResponse>(`${APPS_BASE[scope]}/${appId}/permissions`, body);
