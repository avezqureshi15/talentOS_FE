import type { Role } from "@/constants/roles";

export type RequireRoleProps = {
  minimumRole: Role;
  children: React.ReactNode;
};
