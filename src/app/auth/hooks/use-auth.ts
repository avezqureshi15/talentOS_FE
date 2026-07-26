import { useContext } from "react";
import { AuthContext } from "@/app/auth/components/auth-context";
import { hasMinimumRole } from "@/constants/roles";
import type { Role } from "@/constants/roles";

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const useRole = () => {
  const { user } = useAuth();
  return {
    role: user?.role,
    hasRole: (minimumRole: Role) => hasMinimumRole(user?.role, minimumRole),
  };
};
