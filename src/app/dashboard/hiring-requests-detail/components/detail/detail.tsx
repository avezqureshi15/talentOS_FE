import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./detail.css";

import JobDescription from "@/app/dashboard/hiring-requests-detail/components/job-desc/job-desc";
import Applicants from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants";
import FinalVerdict from "@/app/dashboard/hiring-requests-detail/components/final-verdict/final-verdict";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import BaseModal from "@/components/ui/modal/base-modal";
import { useToggleStatus } from "@/app/dashboard/hiring-requests/hooks/use-toggle-status";
import { JOB_DETAIL } from "@/constants/constants";
import { useApplicationsData } from "@/app/dashboard/hiring-requests-detail/components/detail/use-applications-data";
import { useExportCsv } from "@/app/dashboard/hiring-requests-detail/components/detail/use-export-csv";
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
  // justification: tracks confirm modal visibility for close/reopen
  const [showConfirm, setShowConfirm] = useState(false);
  // justification: controls applicant filter value (shortlisted, all, etc.)
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  // justification: score range filter preset
  const [scoreFilter, setScoreFilter] = useState<string>("all");

  const { mutate: toggleStatus, isPending: isToggling } = useToggleStatus();

  const { handleExport, isExporting, exportError } = useExportCsv(
    hiringRequest.id,
    hiringRequest.title,
  );

  const scoreRange = SCORE_FILTER_MAP[scoreFilter] ?? {};
  const jobId = hiringRequest.id;
  const { applicants, isLoading: appsLoading, hasMore, fetchNext, refresh } = useApplicationsData(
    jobId,
    filter,
    segment === "applicants",
    applicantParam ? PAGINATION.APPLICATIONS_SEARCH_SIZE : undefined,
    scoreRange.min,
    scoreRange.max,
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
          {!hiringRequest.is_active && <span className="closed-chip">Application Closed</span>}
        </div>

        <div className="header-actions">
          <button className="export-btn" onClick={handleExport} disabled={isExporting}>
            {isExporting ? "Downloading..." : JOB_DETAIL.EXPORT_AS_EXCEL}
          </button>
          {exportError && <span className="export-error">{exportError}</span>}
          <button
            className={`status-btn ${hiringRequest.is_active ? "status-btn-close" : "status-btn-open"}`}
            onClick={() => setShowConfirm(true)}
            disabled={isToggling}
            title={hiringRequest.is_active ? "Close Application" : "Reopen Application"}
          >
            {isToggling ? <LoadingSpinner size="sm" /> : <i className={`bx ${hiringRequest.is_active ? "bx-x-circle" : "bx-check-circle"}`} />}
          </button>
        </div>

        <BaseModal open={showConfirm} onClose={() => setShowConfirm(false)} title={hiringRequest.is_active ? "Close Application" : "Reopen Application"}>
          <div className="confirm-body">
            <p>Are you sure you want to {hiringRequest.is_active ? "close" : "reopen"} this application?</p>
            <div className="confirm-actions">
              <button className="confirm-btn confirm-cancel" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="confirm-btn confirm-proceed" onClick={() => { toggleStatus(hiringRequest.id); setShowConfirm(false); }} disabled={isToggling}>
                {isToggling ? "..." : hiringRequest.is_active ? "Close" : "Reopen"}
              </button>
            </div>
          </div>
        </BaseModal>
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
