import { Navigate } from "react-router-dom";
import { usePermissions } from "@/hooks/use-permissions";
import { useAuth } from "@/app/auth/hooks/use-auth";
import { ROUTES } from "@/constants/routes";
import type { Permission } from "@/constants/permissions";
import type { ReactNode } from "react";

export default function RequirePermission({
  permission,
  allowedRoles,
  children,
}: {
  permission: Permission;
  allowedRoles?: string[];
  children: ReactNode;
}) {
  const { can } = usePermissions();
  const { user } = useAuth();
  if (!can(permission)) return <Navigate to={ROUTES.CHAT} replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role ?? "")) {
    return <Navigate to={ROUTES.CHAT} replace />;
  }
  return <>{children}</>;
}
