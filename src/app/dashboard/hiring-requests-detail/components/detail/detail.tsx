import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./detail.css";

import Applicants from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants";
import ApplicantFilters from "@/app/dashboard/hiring-requests-detail/components/applicants/applicant-filters";
import PipelineStages from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages";
import { PIPELINE_STAGES } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.constants";
import type { StageKey } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.types";
import CandidateTable from "@/app/dashboard/hiring-requests-detail/components/candidate-table/candidate-table";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import { useApplicationsData } from "@/app/dashboard/hiring-requests-detail/components/detail/use-applications-data";
import { DEFAULT_FILTER } from "@/app/dashboard/hiring-requests-detail/components/detail/detail.constants";
import { PAGINATION } from "@/constants/api-endpoints";
import { springSnap, fadeSlideUp, staggerContainer } from "@/utils/motion";
import type { JobDetailProps } from "./detail.types";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

const STAGE_FILTER_MAP: Record<StageKey, (a: Applicant) => boolean> = {
  "resume-shortlisting": (a) => a.status === "new" || a.status === "resume_shortlisted",
  screening: (a) => a.status === "under_evaluation",
  interview: (a) => a.status === "interview_scheduled" || a.status === "interview_rescheduled" || a.status === "interview_cancelled",
  "waiting-evaluation": (a) => a.status === "waiting_for_review",
  evaluated: (a) => a.score != null || !!a.reviewVerdict,
  outcome: (a) => a.finalVerdict === "SELECTED" || a.finalVerdict === "REJECTED",
};

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
  const [viewMode, setViewMode] = useState<"table" | "card">(
    (searchParams.get("view") as "table" | "card") ?? "table"
  );
  const [activeStage, setActiveStage] = useState<StageKey>("resume-shortlisting");
  const [openId, setOpenId] = useState<string | null>(applicantParam ?? null);
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  const [rejectReason, setRejectReason] = useState<string>("");
  const [interviewSubFilter, setInterviewSubFilter] = useState<"yet-to-start" | "no-show">("yet-to-start");
  const [evaluatedSubFilter, setEvaluatedSubFilter] = useState<"ai" | "regular">("ai");
  const [outcomeSubFilter, setOutcomeSubFilter] = useState<"selected" | "rejected">("selected");

  const handleRowClick = (candidate: Applicant) => {
    const roundId = candidate.currentRoundId ?? candidate.id;
    window.open(`/hiring-requests/${jobId}/round-details/${roundId}?candidateId=${candidate.id}`, "_blank");
  };

  const scoreRange = SCORE_FILTER_MAP[scoreFilter] ?? {};
  const jobId = hiringRequest.id;
  const isRemote = hiringRequest.location?.toLowerCase() === "remote" || hiringRequest.type?.toLowerCase() === "remote";
  const { applicants, isLoading: appsLoading, isLoadingMore, hasMore, fetchNext, refresh } = useApplicationsData(
    jobId,
    filter,
    true,
    applicantParam ? PAGINATION.APPLICATIONS_SEARCH_SIZE : undefined,
    scoreRange.min,
    scoreRange.max,
    rejectReason,
  );

  const stagesWithCounts = useMemo(() =>
    PIPELINE_STAGES.map((s) => ({
      ...s,
      count: applicants.filter(STAGE_FILTER_MAP[s.key]).length,
    })),
    [applicants],
  );

  const tableData = useMemo(() => {
    if (viewMode !== "table") return applicants;
    let filtered = applicants.filter(STAGE_FILTER_MAP[activeStage]);
    if (activeStage === "interview") {
      const interviewFilters: Record<string, (a: Applicant) => boolean> = {
        "yet-to-start": (a) => a.status === "interview_scheduled" || a.status === "interview_rescheduled",
        "no-show": (a) => a.status === "interview_cancelled",
      };
      filtered = filtered.filter(interviewFilters[interviewSubFilter]);
    }
    if (activeStage === "evaluated") {
      filtered = filtered.filter(
        evaluatedSubFilter === "ai" ? (a) => a.score != null : (a) => !!a.reviewVerdict,
      );
    }
    if (activeStage === "outcome") {
      filtered = filtered.filter(
        outcomeSubFilter === "selected"
          ? (a) => a.finalVerdict === "SELECTED"
          : (a) => a.finalVerdict === "REJECTED",
      );
    }
    return filtered;
  }, [applicants, viewMode, activeStage, interviewSubFilter, evaluatedSubFilter, outcomeSubFilter]);

  const [isSearchingForApplicant, setIsSearchingForApplicant] = useState(false);
  const scrollAttemptedRef = useRef(false);

  useEffect(() => {
    if (!applicantParam || scrollAttemptedRef.current) return;
    if (appsLoading || isLoadingMore) return;

    const found = applicants.some((a) => a.id === applicantParam);

    if (found) {
      scrollAttemptedRef.current = true;
      setIsSearchingForApplicant(false);
      setOpenId(applicantParam);

      const scrollTimer = setTimeout(() => {
        const el = document.querySelector(`[data-applicant-id="${applicantParam}"]`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);

      const clearTimer = setTimeout(() => {
        setSearchParams((prev) => {
          prev.delete("applicant");
          prev.delete("view");
          return prev;
        });
      }, 3000);

      return () => {
        clearTimeout(scrollTimer);
        clearTimeout(clearTimer);
      };
    }

    if (hasMore) {
      setIsSearchingForApplicant(true);
      fetchNext();
    } else {
      setIsSearchingForApplicant(false);
      scrollAttemptedRef.current = true;
      const clearTimer = setTimeout(() => {
        setSearchParams((prev) => {
          prev.delete("applicant");
          prev.delete("view");
          return prev;
        });
      }, 4000);
      return () => clearTimeout(clearTimer);
    }
  }, [applicantParam, appsLoading, isLoadingMore, applicants, hasMore, fetchNext, setSearchParams, setOpenId]);

  return (
    <div className="job-page">
      <PipelineStages
        stages={stagesWithCounts}
        activeKey={activeStage}
        onStageChange={setActiveStage}
      />
      <motion.div className="tab-content" variants={staggerContainer} initial="hidden" animate="visible">
        <ErrorBoundary>
          <div className="persistent-view-toggle">
            <motion.button
              className={`view-toggle-icon${viewMode === "table" ? " view-toggle-icon--active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Table view"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={springSnap}
            >
              <i className="bx bx-border-all" />
            </motion.button>
            <motion.button
              className={`view-toggle-icon${viewMode === "card" ? " view-toggle-icon--active" : ""}`}
              onClick={() => setViewMode("card")}
              title="Card view"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={springSnap}
            >
              <i className="bx bx-grid" />
            </motion.button>
          </div>

          {activeStage === "resume-shortlisting" && (
            <ApplicantFilters
              filter={filter}
              onFilterChange={setFilter}
              scoreFilter={scoreFilter}
              onScoreFilterChange={setScoreFilter}
              rejectReason={rejectReason}
              onRejectReasonChange={setRejectReason}
            />
          )}
          {activeStage === "interview" && (
            <div className="filter-bar filter-bar-sections">
              <div className="filter-section filter-section-status">
                <div className="status-toggle-group">
                  <button
                    className={`status-toggle-btn${interviewSubFilter === "yet-to-start" ? " active" : ""}`}
                    onClick={() => setInterviewSubFilter("yet-to-start")}
                  >
                    Yet to Start
                  </button>
                  <button
                    className={`status-toggle-btn${interviewSubFilter === "no-show" ? " active" : ""}`}
                    onClick={() => setInterviewSubFilter("no-show")}
                  >
                    No Show
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeStage === "interview" && <div className="filter-chips" />}

          {activeStage === "evaluated" && (
            <div className="filter-bar filter-bar-sections">
              <div className="filter-section filter-section-status">
                <div className="status-toggle-group">
                  <button
                    className={`status-toggle-btn${evaluatedSubFilter === "ai" ? " active" : ""}`}
                    onClick={() => setEvaluatedSubFilter("ai")}
                  >
                    AI
                  </button>
                  <button
                    className={`status-toggle-btn${evaluatedSubFilter === "regular" ? " active" : ""}`}
                    onClick={() => setEvaluatedSubFilter("regular")}
                  >
                    Regular
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeStage === "evaluated" && <div className="filter-chips" />}

          {activeStage === "outcome" && (
            <div className="filter-bar filter-bar-sections">
              <div className="filter-section filter-section-status">
                <div className="status-toggle-group">
                  <button
                    className={`status-toggle-btn${outcomeSubFilter === "selected" ? " active" : ""}`}
                    onClick={() => setOutcomeSubFilter("selected")}
                  >
                    Selected
                  </button>
                  <button
                    className={`status-toggle-btn${outcomeSubFilter === "rejected" ? " active" : ""}`}
                    onClick={() => setOutcomeSubFilter("rejected")}
                  >
                    Rejected
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeStage === "outcome" && <div className="filter-chips" />}

          {viewMode === "card" ? (
            <>
              <AnimatePresence>
                {isSearchingForApplicant && (
                  <motion.div
                    className="applicant-search-indicator"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <i className="bx bx-search" />
                    <span>Searching for applicant across pages...</span>
                  </motion.div>
                )}
                {!isSearchingForApplicant && scrollAttemptedRef.current && applicantParam && !applicants.some((a) => a.id === applicantParam) && (
                  <motion.div
                    className="applicant-search-indicator applicant-search-indicator--not-found"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <i className="bx bx-x-circle" />
                    <span>Applicant not found in this hiring request.</span>
                  </motion.div>
                )}
              </AnimatePresence>
              {appsLoading ? (
                <motion.div variants={fadeSlideUp}><LoadingSpinner /></motion.div>
              ) : (
                <motion.div variants={fadeSlideUp}><Applicants
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
                  isRemote={isRemote}
                /></motion.div>
              )}
            </>
          ) : (
            <motion.div variants={fadeSlideUp}>
              <CandidateTable
                data={tableData}
                onRowClick={(candidate) => handleRowClick(candidate as Applicant)}
              />
            </motion.div>
          )}
        </ErrorBoundary>
      </motion.div>
    </div>
  );
};

export default JobDetail;
