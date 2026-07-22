import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./detail.css";

import JobDescription from "@/app/dashboard/hiring-requests-detail/components/job-desc/job-desc";
import Applicants from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants";
import FinalVerdict from "@/app/dashboard/hiring-requests-detail/components/final-verdict/final-verdict";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import Chip from "@/components/ui/chip/chip";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import { JOB_DETAIL } from "@/constants/constants";
import { useApplicationsData } from "@/app/dashboard/hiring-requests-detail/components/detail/use-applications-data";
import { DEFAULT_FILTER } from "@/app/dashboard/hiring-requests-detail/components/detail/detail.constants";
import { PAGINATION } from "@/constants/api-endpoints";
import type { JobDetailProps, Segment } from "./detail.types";

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
  // justification: tracks active tab segment (job description vs applicants)
  const [segment, setSegment] = useState<Segment>(applicantParam ? "applicants" : "jd");
  // justification: tracks which applicant accordion is expanded
  const [openId, setOpenId] = useState<string | null>(applicantParam ?? null);
  // justification: controls applicant filter value (shortlisted, all, etc.)
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  // justification: score range filter preset
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  // justification: multi-select rejection reason filter (comma-separated)
  const [rejectReason, setRejectReason] = useState<string>("");

  const scoreRange = SCORE_FILTER_MAP[scoreFilter] ?? {};
  const jobId = hiringRequest.id;
  const { applicants, isLoading: appsLoading, hasMore, fetchNext, refresh } = useApplicationsData(
    jobId,
    filter,
    segment === "applicants",
    applicantParam ? PAGINATION.APPLICATIONS_SEARCH_SIZE : undefined,
    scoreRange.min,
    scoreRange.max,
    rejectReason,
  );

  const scrolledRef = useRef(false);

  // justification: scroll + highlight after applicant appears, or clear param if not found
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
    // justification: clear ?applicant= param after highlight animation completes
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
      <div className="job-header">
        <Link to="/hiring-requests" className="back-btn">
          <i className="bx bx-arrow-left-stroke"></i>
        </Link>

        <div className="header-text">
          {hiringRequest.title}
          {!hiringRequest.is_active && <Chip variant="danger" size="sm">Application Closed</Chip>}
        </div>
      </div>

      <div className="job-subtitle">
        {hiringRequest.department} &middot; {hiringRequest.location} &middot; {hiringRequest.type}
      </div>

      <div className="segment-nav">
        <button
          className={`segment-item ${segment === "jd" ? "active" : ""}`}
          onClick={() => setSegment("jd")}
        >
          {JOB_DETAIL.JOB_DESCRIPTION}
        </button>

        <button
          className={`segment-item ${segment === "applicants" ? "active" : ""}`}
          onClick={() => setSegment("applicants")}
        >
          {segment === "applicants"
            ? `Applicants (${applicants.length})`
            : "Applicants"}
        </button>

        <button
          className={`segment-item ${segment === "final-verdict" ? "active" : ""}`}
          onClick={() => setSegment("final-verdict")}
        >
          Final Verdict
        </button>
      </div>

      <div className="tab-content">
        <ErrorBoundary>
          {segment === "jd" && <JobDescription hiringRequest={hiringRequest} />}
          {segment === "applicants" && (
            appsLoading ? (
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
            )
          )}

          {segment === "final-verdict" && (
            <FinalVerdict jobId={hiringRequest.external_job_id ?? ""} />
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default JobDetail;
