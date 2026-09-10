export type CreatedByBrief = {
  id: number;
  name: string | null;
  email: string | null;
};

export type AppResponse = {
  id: number;
  name: string;
  description: string | null;
  key_prefix: string;
  is_active: boolean;
  expires_at: string | null;
  last_used_at: string | null;
  created_at: string;
  tenant_id: number | null;
  tenant_name: string | null;
  role: string | null;
  created_by: CreatedByBrief | null;
};

export type AppCreatedResponse = AppResponse & {
  full_key: string;
};

export type AppListResponse = {
  data: AppResponse[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
};

export type PermissionInfo = {
  code: string;
  name: string;
  group: string;
  assigned: boolean;
  endpoint: string;
};

export type AppDetailResponse = AppResponse & {
  permissions: PermissionInfo[];
};

export type CreateAppRequest = {
  name: string;
  description?: string;
  tenant_id?: number | null;
  role?: string | null;
  expires_at?: string | null;
};

export type UpdateAppRequest = {
  name?: string;
  description?: string;
  role?: string | null;
  expires_at?: string | null;
};

export type UpdatePermissionsRequest = {
  permission_codes: string[];
};
