import { useAuth } from "@/app/auth/hooks/use-auth";
import type { Permission } from "@/constants/permissions";

export const usePermissions = () => {
  const { user } = useAuth();
  const permissions = user?.permissions ?? [];

  return {
    can: (permission: Permission) => permissions.includes(permission),
    canAny: (...perms: Permission[]) => perms.some((p) => permissions.includes(p)),
    canAll: (...perms: Permission[]) => perms.every((p) => permissions.includes(p)),
  };
};
