import { useQueryClient } from "@tanstack/react-query";
import HiringRequestsTable from "@/app/dashboard/hiring-requests/components/table/table";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import { useHiringRequests } from "@/app/dashboard/hiring-requests/hooks/use-hiring-requests";
import { QUERY_KEYS } from "@/constants/constants";
import "./hiring-requests.css";

const HiringRequests = () => {
  const { data, isLoading, error } = useHiringRequests();
  const queryClient = useQueryClient();

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HIRING_REQUESTS] });
  };

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <ErrorBoundary>
      <div className="hiring-requests-page">
        <div className="page-heading">All Hiring Requests</div>
        <HiringRequestsTable
          data={data ?? []}
          isLoading={false}
          error={error?.message ?? null}
          onRetry={handleRetry}
        />
      </div>
    </ErrorBoundary>
  );
};

export default HiringRequests;
