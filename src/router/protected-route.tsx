import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import { ROUTES } from "@/constants/routes";

// TODO: Replace this placeholder with a real auth check from a store or context
const isAuthenticated = true;

export default function ProtectedRoute() {
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner size="lg" fullPage />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  );
}