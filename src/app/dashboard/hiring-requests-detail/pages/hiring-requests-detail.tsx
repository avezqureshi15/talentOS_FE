import { useParams } from "react-router-dom";
import JobDetail from "@/app/dashboard/hiring-requests-detail/components/detail/detail";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ErrorFallback from "@/components/ui/error-fallback/error-fallback";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import { useHiringRequest } from "@/app/dashboard/hiring-requests/hooks/use-hiring-requests";

const HiringRequestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error, refetch } = useHiringRequest(id);

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  if (error) {
    return <ErrorFallback message={error.message} onRetry={() => refetch()} />;
  }

  if (!data) {
    return null;
  }

  return (
    <ErrorBoundary>
      <JobDetail hiringRequest={data} />
    </ErrorBoundary>
  );
};

export default HiringRequestDetails;
