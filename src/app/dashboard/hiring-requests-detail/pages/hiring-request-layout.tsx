import { Outlet, useParams } from "react-router-dom";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ErrorFallback from "@/components/ui/error-fallback/error-fallback";
import { useHiringRequest } from "@/app/dashboard/hiring-requests/hooks/use-hiring-requests";

export type HiringRequestContext = {
  data: NonNullable<ReturnType<typeof useHiringRequest>["data"]>;
  id: string;
};

const HiringRequestLayout = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error, refetch } = useHiringRequest(id);

  if (isLoading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorFallback message={error.message} onRetry={() => refetch()} />;
  if (!data || !id) return null;

  return <Outlet context={{ data, id } as HiringRequestContext} />;
};

export default HiringRequestLayout;
