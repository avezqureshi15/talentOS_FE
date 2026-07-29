export type ApiKeyResponse = {
  id: number;
  name: string;
  description: string | null;
  key_prefix: string;
  is_active: boolean;
  expires_at: string | null;
  last_used_at: string | null;
  created_at: string;
};

export type ApiKeyCreatedResponse = ApiKeyResponse & {
  full_key: string;
};

export type ApiKeyListResponse = {
  data: ApiKeyResponse[];
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

export type ApiKeyDetailResponse = ApiKeyResponse & {
  permissions: PermissionInfo[];
};

export type CreateAppRequest = {
  name: string;
  description?: string;
};

export type UpdateAppRequest = {
  name?: string;
  description?: string;
};

export type UpdatePermissionsRequest = {
  permission_codes: string[];
};
