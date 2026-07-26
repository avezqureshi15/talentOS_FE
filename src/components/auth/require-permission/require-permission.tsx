import { usePermissions } from "@/hooks/use-permissions";
import type { RequirePermissionProps } from "./require-permission.types";

export default function RequirePermission({ permission, fallback = null, children }: RequirePermissionProps) {
  const { can } = usePermissions();
  if (!can(permission)) return <>{fallback}</>;
  return <>{children}</>;
}
