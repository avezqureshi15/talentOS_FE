import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export type Tenant = {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  verification_status: string;
  user_count: number;
  logo_url: string | null;
  website: string | null;
  phone: string | null;
  description: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  gst_number: string | null;
  created_at: string;
  updated_at: string;
};

export type PaginatedTenants = {
  data: Tenant[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
};

export type TenantAdminDetails = {
  tenant_id: number;
  name: string;
  slug: string;
  admin_email: string;
  admin_name: string;
  invite_token: string;
  expires_at: string;
};

export type CreateTenantRequest = {
  org_name: string;
  admin_name: string;
  admin_email: string;
};

export type UpdateTenantRequest = {
  name?: string;
  verification_status?: string;
  is_active?: boolean;
};

export type ListTenantsParams = {
  page?: number;
  per_page?: number;
  q?: string;
  status?: string;
};

export const getTenants = (params: ListTenantsParams = {}) =>
  httpClient.get<PaginatedTenants>(API_ENDPOINTS.SUPERADMIN_TENANTS, { params });

export const getTenant = (id: number) =>
  httpClient.get<Tenant>(`${API_ENDPOINTS.SUPERADMIN_TENANTS}/${id}`);

export const createTenant = (body: CreateTenantRequest) =>
  httpClient.post<TenantAdminDetails>(API_ENDPOINTS.SUPERADMIN_TENANTS, body);

export const updateTenant = (id: number, body: UpdateTenantRequest) =>
  httpClient.patch<Tenant>(`${API_ENDPOINTS.SUPERADMIN_TENANTS}/${id}`, body);

export const deleteTenant = (id: number) =>
  httpClient.delete<{ message: string }>(`${API_ENDPOINTS.SUPERADMIN_TENANTS}/${id}`);
