import { Navigate } from "react-router-dom";
import { usePermissions } from "@/hooks/use-permissions";
import { ROUTES } from "@/constants/routes";
import type { Permission } from "@/constants/permissions";
import type { ReactNode } from "react";

export default function RequirePermission({
  permission,
  children,
}: {
  permission: Permission;
  children: ReactNode;
}) {
  const { can } = usePermissions();
  if (!can(permission)) return <Navigate to={ROUTES.CHAT} replace />;
  return <>{children}</>;
}
