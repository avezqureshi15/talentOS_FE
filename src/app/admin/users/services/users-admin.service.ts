import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export type AdminUser = {
  id: number;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  auth_provider: string;
  tenant_id: number | null;
  created_at: string;
};

export type PaginatedAdminUsers = {
  data: AdminUser[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
};

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  role: string;
  tenant_id?: number;
};

export type UpdateUserPayload = {
  name?: string;
  role?: string;
  is_active?: boolean;
  password?: string;
  tenant_id?: number;
};

export type Invite = {
  id: number;
  email: string;
  role: string;
  token: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
};

export type PaginatedInvites = {
  data: Invite[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
};

export type CreateInvitePayload = {
  email: string;
  role: string;
  tenant_id?: number;
};

export type UserJobAssignment = {
  hiring_request_id: string;
  job_title: string;
  role: string;
  is_owner: boolean;
  created_at: string;
};

export type UserJobAssignments = {
  user_id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  total: number;
  data: UserJobAssignment[];
};

export const getUsers = (params: { q?: string; page?: number; per_page?: number; tenant_id?: number }) =>
  httpClient.get<PaginatedAdminUsers>(API_ENDPOINTS.ADMIN_USERS, { params });

export const getUserJobAssignments = (userId: number, tenantId?: number) =>
  httpClient.get<UserJobAssignments>(API_ENDPOINTS.ADMIN_USER_JOB_ASSIGNMENTS.replace("{user_id}", String(userId)), {
    params: tenantId ? { tenant_id: tenantId } : undefined,
  });

export const updateUserJobRole = (
  hiringRequestId: string,
  userId: number,
  payload: { role: string }
) =>
  httpClient.patch(
    API_ENDPOINTS.JOB_TEAM_MEMBER.replace("{hiring_request_id}", hiringRequestId).replace("{user_id}", String(userId)),
    payload
  );

export const createUser = (payload: CreateUserPayload) =>
  httpClient.post<AdminUser>(API_ENDPOINTS.ADMIN_USERS, payload);

export const updateUser = (id: number, payload: UpdateUserPayload) =>
  httpClient.patch<AdminUser>(`${API_ENDPOINTS.ADMIN_USERS}/${id}`, payload);

export const deactivateUser = (id: number, tenantId?: number) =>
  httpClient.delete<{ message: string }>(`${API_ENDPOINTS.ADMIN_USERS}/${id}`, {
    params: tenantId ? { tenant_id: tenantId } : undefined,
  });

export const getInvites = (params: { page?: number; per_page?: number; tenant_id?: number }) =>
  httpClient.get<PaginatedInvites>(API_ENDPOINTS.ADMIN_USERS_INVITES, { params });

export const createInvite = (payload: CreateInvitePayload) =>
  httpClient.post<Invite>(API_ENDPOINTS.ADMIN_USERS_INVITES, payload);

export const revokeInvite = (id: number, tenantId?: number) =>
  httpClient.delete<{ message: string }>(`${API_ENDPOINTS.ADMIN_USERS_INVITES}/${id}`, {
    params: tenantId ? { tenant_id: tenantId } : undefined,
  });
