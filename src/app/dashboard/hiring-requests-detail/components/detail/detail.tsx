import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import "./detail.css";

import Applicants from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants";
import PipelineStages from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages";
import { PIPELINE_STAGES } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.constants";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import { useApplicationsData } from "@/app/dashboard/hiring-requests-detail/components/detail/use-applications-data";
import { DEFAULT_FILTER } from "@/app/dashboard/hiring-requests-detail/components/detail/detail.constants";
import { PAGINATION } from "@/constants/api-endpoints";
import type { JobDetailProps } from "./detail.types";

const SCORE_FILTER_MAP: Record<string, { min?: number; max?: number }> = {
  all: {},
  gte80: { min: 80 },
  gte70: { min: 70 },
  gte50: { min: 50 },
  lt50: { max: 49 },
  lt30: { max: 29 },
};

const JobDetail = ({ hiringRequest }: JobDetailProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const applicantParam = searchParams.get("applicant");
  const [openId, setOpenId] = useState<string | null>(applicantParam ?? null);
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  const [rejectReason, setRejectReason] = useState<string>("");

  const scoreRange = SCORE_FILTER_MAP[scoreFilter] ?? {};
  const jobId = hiringRequest.id;
  const { applicants, isLoading: appsLoading, hasMore, fetchNext, refresh } = useApplicationsData(
    jobId,
    filter,
    true,
    applicantParam ? PAGINATION.APPLICATIONS_SEARCH_SIZE : undefined,
    scoreRange.min,
    scoreRange.max,
    rejectReason,
  );

  const scrolledRef = useRef(false);

  useEffect(() => {
    if (!applicantParam || appsLoading || scrolledRef.current) return;
    const found = applicants.some((a) => a.id === applicantParam);
    if (!found) {
      if (!hasMore) {
        setSearchParams((prev) => {
          prev.delete("applicant");
          return prev;
        });
      }
      return;
    }
    scrolledRef.current = true;
    const scrollTimer = setTimeout(() => {
      const el = document.querySelector(`[data-applicant-id="${applicantParam}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
    const clearTimer = setTimeout(() => {
      setSearchParams((prev) => {
        prev.delete("applicant");
        return prev;
      });
    }, 3000);
    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(clearTimer);
    };
  }, [applicantParam, appsLoading, applicants, hasMore, setSearchParams]);

  return (
    <div className="job-page">
      <PipelineStages stages={PIPELINE_STAGES} />

      <div className="tab-content">
        <ErrorBoundary>
          {appsLoading ? (
            <LoadingSpinner />
          ) : (
            <Applicants
              data={applicants}
              openId={openId}
              setOpenId={setOpenId}
              filter={filter}
              onFilterChange={setFilter}
              hasMore={hasMore}
              onLoadMore={fetchNext}
              scoreFilter={scoreFilter}
              onScoreFilterChange={setScoreFilter}
              rejectReason={rejectReason}
              onRejectReasonChange={setRejectReason}
              applicantParam={applicantParam}
              onRefresh={refresh}
              jdId={hiringRequest.id}
              isRemote={hiringRequest.location?.toLowerCase() === "remote" || hiringRequest.type?.toLowerCase() === "remote"}
            />
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default JobDetail;
