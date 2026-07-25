import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./detail.css";

import Applicants from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants";
import PipelineStages from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages";
import { PIPELINE_STAGES } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.constants";
import type { StageKey } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.types";
import CandidateTable from "@/app/dashboard/hiring-requests-detail/components/candidate-table/candidate-table";
import { EVALUATED_SUB_FILTERS, MOCK_CANDIDATES } from "@/app/dashboard/hiring-requests-detail/components/candidate-table/candidate-table.constants";
import RecruiterFilter from "@/app/dashboard/hiring-requests-detail/components/applicants/recruiter-filter";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import { useApplicationsData } from "@/app/dashboard/hiring-requests-detail/components/detail/use-applications-data";
import { DEFAULT_FILTER } from "@/app/dashboard/hiring-requests-detail/components/detail/detail.constants";
import { PAGINATION } from "@/constants/api-endpoints";
import { springSnap, fadeSlideUp, staggerContainer } from "@/utils/motion";
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
  // justification: tracks active pipeline stage for candidate table
  const [activeStage, setActiveStage] = useState<StageKey>("yet-to-start");
  // justification: toggles between card and table view
  const [viewMode, setViewMode] = useState<"table" | "card">(
    (searchParams.get("view") as "table" | "card") ?? "table"
  );
  // justification: selected candidate ids for batch actions in table view
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  // justification: tracks which applicant accordion is expanded (card view)
  const [openId, setOpenId] = useState<string | null>(applicantParam ?? null);
  // justification: controls applicant filter value (card view)
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  // justification: score range filter preset (card view)
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  // justification: multi-select rejection reason filter (card view)
  const [rejectReason, setRejectReason] = useState<string>("");
  // justification: evaluated sub-filter (table view)
  const [subFilter, setSubFilter] = useState("all");
  // justification: archived search query (table view)
  const [archivedSearch, setArchivedSearch] = useState("");


  const handleRowClick = (candidateId: string) => {
    window.open(`/hiring-requests/${jobId}/round-details/${candidateId}`, "_blank");
  };

  const scoreRange = SCORE_FILTER_MAP[scoreFilter] ?? {};
  const jobId = hiringRequest.id;
  const isRemote = hiringRequest.location?.toLowerCase() === "remote" || hiringRequest.type?.toLowerCase() === "remote";
  const { applicants, isLoading: appsLoading, isLoadingMore, hasMore, fetchNext, refresh } = useApplicationsData(
    jobId,
    filter,
    viewMode === "card",
    applicantParam ? PAGINATION.APPLICATIONS_SEARCH_SIZE : undefined,
    scoreRange.min,
    scoreRange.max,
    rejectReason,
  );

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
        stages={PIPELINE_STAGES}
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
            <>
              {activeStage === "archived" && (
                <motion.div variants={fadeSlideUp} className="archived-search-bar">
                  <i className="bx bx-search" />
                  <input
                    className="archived-search-input"
                    placeholder="Search candidates..."
                    value={archivedSearch}
                    onChange={(e) => setArchivedSearch(e.target.value)}
                  />
                </motion.div>
              )}
              {activeStage !== "evaluated" && (
                <motion.div variants={fadeSlideUp}><RecruiterFilter /></motion.div>
              )}

              {activeStage === "evaluated" && (
                <motion.div variants={fadeSlideUp} className="evaluated-sub-filters">
                  {EVALUATED_SUB_FILTERS.map((f) => {
                    const count = f.key === "all"
                      ? MOCK_CANDIDATES.evaluated.length
                      : f.key === "completed"
                        ? MOCK_CANDIDATES.evaluated.filter((c) => c.results && c.results.length > 0).length
                        : MOCK_CANDIDATES.evaluated.filter((c) => c.partialProgress).length;
                    return (
                      <motion.button
                        key={f.key}
                        className={`evaluated-sub-filter-btn ${subFilter === f.key ? "evaluated-sub-filter-btn--active" : ""}`}
                        onClick={() => setSubFilter(f.key)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        transition={springSnap}
                      >
                        {f.label} ({count})
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}

              <motion.div variants={fadeSlideUp}>
                <CandidateTable
                  stage={activeStage}
                  data={[]}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                  subFilter={activeStage === "evaluated" ? subFilter : undefined}
                  onRowClick={(candidate) => handleRowClick(candidate.id)}
                />
              </motion.div>
            </>
          )}
        </ErrorBoundary>
      </motion.div>
    </div>
  );
};

export default JobDetail;
