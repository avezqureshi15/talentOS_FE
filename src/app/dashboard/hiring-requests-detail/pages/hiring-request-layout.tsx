import { Outlet, useParams } from "react-router-dom";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ErrorFallback from "@/components/ui/error-fallback/error-fallback";
import { useHiringRequest } from "@/app/dashboard/hiring-requests/hooks/use-hiring-requests";
import { useApplicationsData } from "@/app/dashboard/hiring-requests-detail/components/detail/use-applications-data";
import { useInterviewCount } from "@/app/dashboard/hiring-requests-detail/components/detail/use-interview-count";
import { ApplicationsContext } from "@/app/dashboard/hiring-requests-detail/components/detail/applications-context";

export type HiringRequestContext = {
  data: NonNullable<ReturnType<typeof useHiringRequest>["data"]>;
  id: string;
};

const HiringRequestLayout = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error, refetch } = useHiringRequest(id);

  const appsData = useApplicationsData(id, "all", true);
  const interviewCount = useInterviewCount(id);

  if (isLoading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorFallback message={error.message} onRetry={() => refetch()} />;
  if (!data || !id) return null;

  return (
    <ApplicationsContext.Provider value={{
      ...appsData,
      interviewCount,
      finalizedApplicants: [],
      finalizedTotal: 0,
      finalizedLoading: false,
      finalizedRefresh: () => {},
    }}>
      <Outlet context={{ data, id } as HiringRequestContext} />
    </ApplicationsContext.Provider>
  );
};

export default HiringRequestLayout;
