import httpClient from "@/services/http-client";
import type { RoleData, RoleListItem } from "../pages/roles-page.types";

export type PermissionsListResponse = {
  permissions: { code: string; name: string; group: string }[];
};

export type RoleListResponse = {
  roles: RoleListItem[];
};

const BASE = "/admin/roles";

export const listRoles = () =>
  httpClient.get<RoleListResponse>(BASE);

export const getRole = (roleName: string) =>
  httpClient.get<RoleData>(`${BASE}/${encodeURIComponent(roleName)}`);

export const updateRolePermissions = (roleName: string, permissionCodes: string[]) =>
  httpClient.put<RoleData>(`${BASE}/${encodeURIComponent(roleName)}/permissions`, {
    permission_codes: permissionCodes,
  });

export const listAllPermissions = () =>
  httpClient.get<PermissionsListResponse>(`${BASE}/permissions`);
