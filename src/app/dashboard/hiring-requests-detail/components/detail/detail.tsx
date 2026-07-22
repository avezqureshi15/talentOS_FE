import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
import { springSnap } from "@/utils/motion";
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
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
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
  const navigate = useNavigate();

  const handleRowClick = (candidateId: string) => {
    navigate(`/hiring-requests/${jobId}/round-details/${candidateId}`);
  };

  const scoreRange = SCORE_FILTER_MAP[scoreFilter] ?? {};
  const jobId = hiringRequest.id;
  const isRemote = hiringRequest.location?.toLowerCase() === "remote" || hiringRequest.type?.toLowerCase() === "remote";
  const { applicants, isLoading: appsLoading, hasMore, fetchNext, refresh } = useApplicationsData(
    jobId,
    filter,
    viewMode === "card",
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
      <PipelineStages
        stages={PIPELINE_STAGES}
        activeKey={activeStage}
        onStageChange={setActiveStage}
      />

      <div className="tab-content">
        <ErrorBoundary>
          {viewMode === "card" ? (
            <>
              <div className="card-view-toggle">
                <motion.button
                  className="view-toggle-icon"
                  onClick={() => setViewMode("table")}
                  title="Table view"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={springSnap}
                >
                  <i className="bx bx-border-all" />
                </motion.button>
                <motion.button
                  className="view-toggle-icon view-toggle-icon--active"
                  title="Card view"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={springSnap}
                >
                  <i className="bx bx-grid" />
                </motion.button>
              </div>
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
                  isRemote={isRemote}
                />
              )}
            </>
          ) : (
            <>
              {activeStage === "archived" && (
                <div className="archived-search-bar">
                  <i className="bx bx-search" />
                  <input
                    className="archived-search-input"
                    placeholder="Search candidates..."
                    value={archivedSearch}
                    onChange={(e) => setArchivedSearch(e.target.value)}
                  />
                </div>
              )}
              {activeStage !== "evaluated" && (
                <RecruiterFilter viewMode={viewMode} onViewModeChange={setViewMode} />
              )}

              {activeStage === "evaluated" && (
                <div className="evaluated-sub-filters">
                  {EVALUATED_SUB_FILTERS.map((f) => {
                    const count = f.key === "all"
                      ? MOCK_CANDIDATES.evaluated.length
                      : f.key === "completed"
                        ? MOCK_CANDIDATES.evaluated.filter((c) => c.results && c.results.length > 0).length
                        : MOCK_CANDIDATES.evaluated.filter((c) => c.partialProgress).length;
                    return (
                      <button
                        key={f.key}
                        className={`evaluated-sub-filter-btn ${subFilter === f.key ? "evaluated-sub-filter-btn--active" : ""}`}
                        onClick={() => setSubFilter(f.key)}
                      >
                        {f.label} ({count})
                      </button>
                    );
                  })}
                </div>
              )}

              <CandidateTable
                stage={activeStage}
                data={[]}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                subFilter={activeStage === "evaluated" ? subFilter : undefined}
                onRowClick={(candidate) => handleRowClick(candidate.id)}
              />
            </>
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default JobDetail;
