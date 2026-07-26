import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import { ROUTES } from "@/constants/routes";
import { useAuth, useRole } from "@/app/auth/hooks/use-auth";
import { usePermissions } from "@/hooks/use-permissions";
import type { ProtectedRouteProps } from "./protected-route.types";

export default function ProtectedRoute({ minimumRole, allowedRoles, permissions }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const { hasRole } = useRole();
  const { canAll } = usePermissions();

  if (isLoading) {
    return <LoadingSpinner size="lg" fullPage />;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (minimumRole && !hasRole(minimumRole)) {
    return <Navigate to={ROUTES.CHAT} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.CHAT} replace />;
  }

  if (permissions && !canAll(...permissions)) {
    return <Navigate to={ROUTES.CHAT} replace />;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner size="lg" fullPage />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  );
}
