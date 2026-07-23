import { useContext } from "react";
import { AuthContext } from "@/app/auth/components/auth-context";

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const useRole = () => {
  const { user } = useAuth();
  return {
    role: user?.role,
    isAdmin: user?.role === "admin" || user?.role === "superadmin",
    isSuperAdmin: user?.role === "superadmin",
    isHR: user?.role === "hr" || user?.role === "admin" || user?.role === "superadmin",
    hasRole: (...roles: string[]) => user ? roles.includes(user.role) : false,
  };
};
