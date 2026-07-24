import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import { ROUTES } from "@/constants/routes";
import { useAuth, useRole } from "@/app/auth/hooks/use-auth";
import type { ProtectedRouteProps } from "./protected-route.types";

export default function ProtectedRoute({ minimumRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const { hasRole } = useRole();

  if (isLoading) {
    return <LoadingSpinner size="lg" fullPage />;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (minimumRole && !hasRole(minimumRole)) {
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
