import { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useParams, useSearchParams } from "react-router-dom";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ErrorFallback from "@/components/ui/error-fallback/error-fallback";
import { useHiringRequest } from "@/app/dashboard/hiring-requests/hooks/use-hiring-requests";
import { useApplicationsData, useFinalizedData } from "@/app/dashboard/hiring-requests-detail/components/detail/use-applications-data";
import { useInterviewCount } from "@/app/dashboard/hiring-requests-detail/components/detail/use-interview-count";
import { ApplicationsContext } from "@/app/dashboard/hiring-requests-detail/components/detail/applications-context";
import { DEFAULT_FILTER, SCORE_FILTER_MAP } from "@/app/dashboard/hiring-requests-detail/components/detail/detail.constants";
import type { StageKey } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.types";
import JobRoleStrip from "@/components/shared/job-role-strip/job-role-strip";

export type HiringRequestContext = {
  data: NonNullable<ReturnType<typeof useHiringRequest>["data"]>;
  id: string;
};

const DEFAULT_SCORE_FILTER = "all";
const DEFAULT_REJECT_REASON = "";

const HiringRequestLayout = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { data, isLoading, error, refetch } = useHiringRequest(id);

  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [scoreFilter, setScoreFilter] = useState(DEFAULT_SCORE_FILTER);
  const [rejectReason, setRejectReason] = useState(DEFAULT_REJECT_REASON);
  const [activeStage, setActiveStage] = useState<StageKey>("resume-shortlisting");

  const scoreRange = SCORE_FILTER_MAP[scoreFilter] ?? {};
  const appsData = useApplicationsData(
    id,
    filter,
    true,
    scoreRange.min,
    scoreRange.max,
    searchParams.get("applicant") ? undefined : activeStage,
    activeStage === "resume-shortlisting" ? rejectReason : undefined,
  );
  const interviewCount = useInterviewCount(id);
  const finalizedData = useFinalizedData(id, !!id);

  const resetListFilters = useCallback(() => {
    setFilter(DEFAULT_FILTER);
    setScoreFilter(DEFAULT_SCORE_FILTER);
    setRejectReason(DEFAULT_REJECT_REASON);
    setActiveStage("resume-shortlisting");
  }, []);

  useEffect(() => {
    if (!location.pathname.includes("/applications")) {
      // Reset list filters after navigation away from the applications tab;
      // deferred so the state reset is not synchronous inside the effect.
      const resetTimer = setTimeout(resetListFilters, 0);
      return () => clearTimeout(resetTimer);
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
      activeStage,
      setActiveStage,
      stageCounts: appsData.stageCounts,
      finalizedApplicants: finalizedData.applicants,
      finalizedTotal: finalizedData.total,
      finalizedLoading: finalizedData.isLoading,
      finalizedRefresh: finalizedData.refresh,
    }),
    [appsData, interviewCount, finalizedData, filter, scoreFilter, rejectReason, resetListFilters, activeStage],
  );

  if (isLoading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorFallback message={error.message} onRetry={() => refetch()} />;
  if (!data || !id) return null;

  return (
    <ApplicationsContext.Provider value={contextValue}>
      {!location.pathname.includes("/applications") && <JobRoleStrip hiringRequestId={id} />}
      <Outlet context={{ data, id } as HiringRequestContext} />
    </ApplicationsContext.Provider>
  );
};

export default HiringRequestLayout;
