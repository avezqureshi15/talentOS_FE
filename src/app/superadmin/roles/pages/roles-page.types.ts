export type PermissionInfo = {
  code: string;
  name: string;
  group: string;
  assigned: boolean;
};

export type RoleData = {
  role_name: string;
  permissions: PermissionInfo[];
};

export type RoleListItem = {
  role_name: string;
  permission_count: number;
  user_count: number;
};
