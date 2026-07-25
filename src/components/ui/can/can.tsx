import type { ReactNode } from "react";
import { usePermissions } from "@/hooks/use-permissions";
import type { Permission } from "@/constants/permissions";

type CanProps = {
  permission: Permission;
  fallback?: ReactNode;
  children: ReactNode;
};

export default function Can({ permission, fallback = null, children }: CanProps) {
  const { can } = usePermissions();
  return can(permission) ? <>{children}</> : <>{fallback}</>;
}
