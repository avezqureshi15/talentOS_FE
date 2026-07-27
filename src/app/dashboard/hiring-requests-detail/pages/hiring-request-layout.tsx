import { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ErrorFallback from "@/components/ui/error-fallback/error-fallback";
import { useHiringRequest } from "@/app/dashboard/hiring-requests/hooks/use-hiring-requests";
import { useApplicationsData } from "@/app/dashboard/hiring-requests-detail/components/detail/use-applications-data";
import { useInterviewCount } from "@/app/dashboard/hiring-requests-detail/components/detail/use-interview-count";
import { ApplicationsContext } from "@/app/dashboard/hiring-requests-detail/components/detail/applications-context";
import { DEFAULT_FILTER, SCORE_FILTER_MAP } from "@/app/dashboard/hiring-requests-detail/components/detail/detail.constants";

export type HiringRequestContext = {
  data: NonNullable<ReturnType<typeof useHiringRequest>["data"]>;
  id: string;
};

const DEFAULT_SCORE_FILTER = "all";
const DEFAULT_REJECT_REASON = "";

const HiringRequestLayout = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { data, isLoading, error, refetch } = useHiringRequest(id);

  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [scoreFilter, setScoreFilter] = useState(DEFAULT_SCORE_FILTER);
  const [rejectReason, setRejectReason] = useState(DEFAULT_REJECT_REASON);

  const scoreRange = SCORE_FILTER_MAP[scoreFilter] ?? {};
  const appsData = useApplicationsData(
    id,
    filter,
    true,
    undefined,
    scoreRange.min,
    scoreRange.max,
  );
  const interviewCount = useInterviewCount(id);

  const resetListFilters = useCallback(() => {
    setFilter(DEFAULT_FILTER);
    setScoreFilter(DEFAULT_SCORE_FILTER);
    setRejectReason(DEFAULT_REJECT_REASON);
  }, []);

  useEffect(() => {
    if (!location.pathname.includes("/applications")) {
      resetListFilters();
    }
  }, [location.pathname, resetListFilters]);

  const contextValue = useMemo(
    () => ({
      ...appsData,
      interviewCount,
      filter,
      scoreFilter,
      rejectReason,
      setFilter,
      setScoreFilter,
      setRejectReason,
      resetListFilters,
    }),
    [appsData, interviewCount, filter, scoreFilter, rejectReason, resetListFilters],
  );

  if (isLoading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorFallback message={error.message} onRetry={() => refetch()} />;
  if (!data || !id) return null;

  return (
    <ApplicationsContext.Provider value={contextValue}>
      <Outlet context={{ data, id } as HiringRequestContext} />
    </ApplicationsContext.Provider>
  );
};

export default HiringRequestLayout;
