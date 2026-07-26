import type { Permission } from "@/constants/permissions";

export type RequirePermissionProps = {
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
};
