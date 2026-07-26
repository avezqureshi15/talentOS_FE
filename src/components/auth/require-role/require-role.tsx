import { hasMinimumRole } from "@/constants/roles";
import { useRole } from "@/app/auth/hooks/use-auth";
import type { RequireRoleProps } from "./require-role.types";

export default function RequireRole({ minimumRole, children }: RequireRoleProps) {
  const { role } = useRole();
  if (!hasMinimumRole(role, minimumRole)) return null;
  return <>{children}</>;
}
