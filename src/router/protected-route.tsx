import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/app/auth/hooks/use-auth";

type Props = { requiredRoles?: string[] };

export default function ProtectedRoute({ requiredRoles }: Props) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner size="lg" fullPage />;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
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
