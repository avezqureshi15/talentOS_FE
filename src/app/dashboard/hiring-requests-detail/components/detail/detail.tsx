import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import "./detail.css";

import Applicants from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants";
import ApplicantFilters from "@/app/dashboard/hiring-requests-detail/components/applicants/applicant-filters";
import PipelineStages from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages";
import { PIPELINE_STAGES } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.constants";
import type { StageKey } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.types";
import CandidateTable from "@/app/dashboard/hiring-requests-detail/components/candidate-table/candidate-table";

import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import BulkScheduleModal from "@/app/dashboard/hiring-requests-detail/components/modal/bulk-schedule-modal";
import BulkRemarksModal from "@/app/dashboard/hiring-requests-detail/components/modal/bulk-remarks-modal";
import { useApplicationsContext } from "@/app/dashboard/hiring-requests-detail/components/detail/applications-context";
import { useFilteredApplicants } from "@/app/dashboard/hiring-requests-detail/components/detail/use-filtered-applicants";
import { useJobDetail } from "@/app/dashboard/hiring-requests-detail/components/detail/use-job-detail";
import { useBulkSelection } from "@/app/dashboard/hiring-requests-detail/components/detail/use-bulk-selection";
import { STAGE_FILTER_MAP, INTERVIEW_SUB_FILTER_MAP, EVALUATED_SUB_FILTER_MAP, UI_SEARCHING_APPLICANT, UI_APPLICANT_NOT_FOUND } from "@/app/dashboard/hiring-requests-detail/components/detail/detail.constants";
import ViewToggle from "@/app/dashboard/hiring-requests-detail/components/detail/view-toggle";
import InterviewFilterBar from "@/app/dashboard/hiring-requests-detail/components/detail/interview-filter-bar";
import EvaluatedFilterBar from "@/app/dashboard/hiring-requests-detail/components/detail/evaluated-filter-bar";
import { fadeSlideUp, staggerContainer } from "@/utils/motion";
import type { JobDetailProps } from "./detail.types";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

const JobDetail = ({ hiringRequest }: JobDetailProps) => {
  const [searchParams] = useSearchParams();
  const applicantParam = searchParams.get("applicant");
  const [activeStage, setActiveStage] = useState<StageKey>("resume-shortlisting");
  const [interviewSubFilter, setInterviewSubFilter] = useState<"yet-to-start" | "no-show">("yet-to-start");
  const [evaluatedSubFilter, setEvaluatedSubFilter] = useState<"ai" | "regular">("ai");

  const jobId = hiringRequest.id;
  const isRemote = hiringRequest.location?.toLowerCase() === "remote" || hiringRequest.type?.toLowerCase() === "remote";
  const {
    applicants,
    isLoading: appsLoading,
    isLoadingMore,
    hasMore,
    fetchNext,
    refresh,
    filter,
    scoreFilter,
    rejectReason,
    setFilter,
    setScoreFilter,
    setRejectReason,
  } = useApplicationsContext();

  const { viewMode, setViewMode, openId, setOpenId, handleRowClick, handleInfoClick, isSearchingForApplicant } = useJobDetail({
    applicantParam, applicants, appsLoading, isLoadingMore, hasMore, fetchNext, jobId,
  });

  const filteredApplicants = useFilteredApplicants({
    applicants, activeStage, interviewSubFilter, evaluatedSubFilter, rejectReason,
  });

  const BULK_STAGE_ACTIONS: Record<string, { screening: boolean; interview: boolean }> = {
    "resume-shortlisting": { screening: true, interview: true },
    "screening": { screening: false, interview: true },
  };
  const showBulkSelection = activeStage in BULK_STAGE_ACTIONS;
  const { screening: showBulkScreening, interview: showBulkInterview } = BULK_STAGE_ACTIONS[activeStage] ?? { screening: false, interview: false };
  const bulkSelection = useBulkSelection(jobId, filteredApplicants, refresh, showBulkSelection);
  const [pendingBulkAction, setPendingBulkAction] = useState<"screening" | "interview" | null>(null);
  const [pendingBulkRemarks, setPendingBulkRemarks] = useState<"screening" | "interview" | null>(null);
  const [selectionStage, setSelectionStage] = useState<string | null>(null);

  useEffect(() => {
    if (showBulkSelection && bulkSelection.selectionCount > 0 && !selectionStage) {
      setSelectionStage(activeStage);
    } else if (bulkSelection.selectionCount === 0 && selectionStage) {
      setSelectionStage(null);
    }
  }, [showBulkSelection, bulkSelection.selectionCount, activeStage, selectionStage]);

  const stageLabel = selectionStage ? (PIPELINE_STAGES.find((s) => s.key === selectionStage)?.label ?? selectionStage) : "";

  const handleBulkRemarksConfirm = (remarks: string) => {
    if (remarks) bulkSelection.handleSubmitRemarks(remarks);
    const action = pendingBulkRemarks;
    setPendingBulkRemarks(null);
    if (action) setPendingBulkAction(action);
  };

  const handleBulkScheduleConfirm = ({ scheduledDate, scheduledTime }: { scheduledDate: string; scheduledTime: string }) => {
    if (pendingBulkAction === "screening") bulkSelection.handleBulkMoveToScreening(scheduledDate, scheduledTime);
    else if (pendingBulkAction === "interview") bulkSelection.handleBulkMoveToInterview(scheduledDate, scheduledTime);
    setPendingBulkAction(null);
  };

  const bulkModalTitle = pendingBulkAction === "screening" ? "Schedule AI Screening" : "Schedule AI Interview";
  const bulkModalLabel = pendingBulkAction === "screening" ? "From when should we start screening calls?" : "Select when the candidate can give the AI interview";
  const bulkModalIncludeEnd = pendingBulkAction === "interview";

  const stagesWithCounts = useMemo(() =>
    PIPELINE_STAGES.map((s) => ({
      ...s,
      count: applicants.filter(STAGE_FILTER_MAP[s.key]).length,
    })),
    [applicants],
  );

  const interviewSubCounts = useMemo(() => ({
    "yet-to-start": applicants.filter(
      (a) => STAGE_FILTER_MAP["interview"](a) && INTERVIEW_SUB_FILTER_MAP["yet-to-start"](a),
    ).length,
    "no-show": applicants.filter(
      (a) => STAGE_FILTER_MAP["interview"](a) && INTERVIEW_SUB_FILTER_MAP["no-show"](a),
    ).length,
  }), [applicants]);

  const evaluatedSubCounts = useMemo(() => ({
    ai: applicants.filter(
      (a) => STAGE_FILTER_MAP["evaluated"](a) && EVALUATED_SUB_FILTER_MAP["ai"](a),
    ).length,
    regular: applicants.filter(
      (a) => STAGE_FILTER_MAP["evaluated"](a) && EVALUATED_SUB_FILTER_MAP["regular"](a),
    ).length,
  }), [applicants]);

  return (
    <div className="job-page">
      <PipelineStages stages={stagesWithCounts} activeKey={activeStage} onStageChange={setActiveStage} />
      <motion.div className="tab-content" variants={staggerContainer} initial="hidden" animate="visible">
        <ErrorBoundary>
          {showBulkSelection && bulkSelection.selectionCount > 0 && (
            <div className="bulk-action-bar">
              <span className="bulk-action-count">{bulkSelection.selectionCount} candidate{bulkSelection.selectionCount !== 1 ? "s" : ""} selected in <span className="bulk-stage-chip">{stageLabel}</span> stage</span>
              <div className="bulk-action-buttons">
                {showBulkScreening && (
                  <button
                    className="btn screen-btn compact"
                    onClick={() => {
                      if (bulkSelection.hasCandidatesWithRound) setPendingBulkRemarks("screening");
                      else setPendingBulkAction("screening");
                    }}
                    disabled={bulkSelection.isBulkProcessing}
                    type="button"
                  >
                    {bulkSelection.isBulkProcessing ? <i className="bx bx-loader-alt bx-spin" /> : <i className="bx bx-phone" />}
                    {" "}Move to AI Screening
                  </button>
                )}
                {showBulkInterview && (
                  <button
                    className="btn screen-btn compact"
                    onClick={() => {
                      if (bulkSelection.hasCandidatesWithRound) setPendingBulkRemarks("interview");
                      else setPendingBulkAction("interview");
                    }}
                    disabled={bulkSelection.isBulkProcessing}
                    type="button"
                  >
                    {bulkSelection.isBulkProcessing ? <i className="bx bx-loader-alt bx-spin" /> : <i className="bx bx-bot" />}
                    {" "}Move to AI Interview
                  </button>
                )}
                <button
                  className="bulk-action-clear"
                  onClick={bulkSelection.clearSelection}
                  disabled={bulkSelection.isBulkProcessing}
                  type="button"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          <ViewToggle viewMode={viewMode} onChange={setViewMode} />

          {activeStage === "resume-shortlisting" && (
            <ApplicantFilters
              filter={filter} onFilterChange={setFilter}
              scoreFilter={scoreFilter} onScoreFilterChange={setScoreFilter}
              rejectReason={rejectReason} onRejectReasonChange={setRejectReason}
            />
          )}
          {activeStage === "interview" && (
            <InterviewFilterBar value={interviewSubFilter} onChange={setInterviewSubFilter} counts={interviewSubCounts} />
          )}
          {activeStage === "interview" && <div className="filter-chips" />}
          {activeStage === "evaluated" && (
            <EvaluatedFilterBar value={evaluatedSubFilter} onChange={setEvaluatedSubFilter} counts={evaluatedSubCounts} />
          )}
          {activeStage === "evaluated" && <div className="filter-chips" />}

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
                    <span>{UI_SEARCHING_APPLICANT}</span>
                  </motion.div>
                )}
                {!isSearchingForApplicant && applicantParam && !applicants.some((a) => a.id === applicantParam) && (
                  <motion.div
                    className="applicant-search-indicator applicant-search-indicator--not-found"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <i className="bx bx-x-circle" />
                    <span>{UI_APPLICANT_NOT_FOUND}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              {appsLoading ? (
                <motion.div variants={fadeSlideUp}><LoadingSpinner /></motion.div>
              ) : (
                <motion.div variants={fadeSlideUp}>
                  <Applicants
                    data={filteredApplicants} openId={openId} setOpenId={setOpenId}
                    filter={filter} onFilterChange={setFilter}
                    hasMore={hasMore} onLoadMore={fetchNext}
                    scoreFilter={scoreFilter} onScoreFilterChange={setScoreFilter}
                    rejectReason={rejectReason} onRejectReasonChange={setRejectReason}
                    applicantParam={applicantParam} onRefresh={refresh}
                    jdId={hiringRequest.id} isRemote={isRemote}
                    showBulkSelection={showBulkSelection}
                    selectedIds={bulkSelection.selectedIds}
                    onToggleSelect={bulkSelection.toggleSelect}
                    onToggleSelectAll={bulkSelection.toggleSelectAll}
                    allSelected={bulkSelection.allSelected}
                    selectionCount={bulkSelection.selectionCount}
                  />
                </motion.div>
              )}
            </>
          ) : (
            <motion.div variants={fadeSlideUp}>
              <CandidateTable
                data={filteredApplicants}
                columns={PIPELINE_STAGES.find((s) => s.key === activeStage)?.columns ?? []}
                onRowClick={(candidate) => handleRowClick(candidate as Applicant)}
                onInfoClick={(candidate) => handleInfoClick(candidate as Applicant)}
                showBulkSelection={showBulkSelection}
                selectedIds={bulkSelection.selectedIds}
                onToggleSelect={bulkSelection.toggleSelect}
                onToggleSelectAll={bulkSelection.toggleSelectAll}
                allSelected={bulkSelection.allSelected}
                activeStage={activeStage}
                loading={appsLoading}
              />
            </motion.div>
          )}
        </ErrorBoundary>

        <BulkRemarksModal
          open={pendingBulkRemarks !== null}
          onClose={() => setPendingBulkRemarks(null)}
          onConfirm={handleBulkRemarksConfirm}
          title={pendingBulkRemarks === "screening" ? "HR Remarks — Move to AI Screening" : "HR Remarks — Move to AI Interview"}
        />
        <BulkScheduleModal
          open={pendingBulkAction !== null}
          onClose={() => setPendingBulkAction(null)}
          onConfirm={handleBulkScheduleConfirm}
          title={bulkModalTitle}
          dateLabel={bulkModalLabel}
          includeEnd={bulkModalIncludeEnd}
        />
      </motion.div>
    </div>
  );
};

export default JobDetail;
