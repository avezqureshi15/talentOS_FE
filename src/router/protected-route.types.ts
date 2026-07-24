import type { Role } from "@/constants/roles";

export type ProtectedRouteProps = {
  minimumRole?: Role;
};
