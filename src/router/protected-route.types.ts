import type { Role } from "@/constants/roles";
import type { Permission } from "@/constants/permissions";

export type ProtectedRouteProps = {
  minimumRole?: Role;
  allowedRoles?: Role[];
  permissions?: Permission[];
  redirectPath?: string;
};
