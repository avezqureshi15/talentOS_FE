import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/constants/permissions";
import "./detail.css";

import ApplicantActionModals from "@/app/dashboard/hiring-requests-detail/components/applicants/applicant-action-modals";
import ApplicantFilters from "@/app/dashboard/hiring-requests-detail/components/applicants/applicant-filters";
import PipelineStages from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages";
import { PIPELINE_STAGES, NAME_SCORE_STATUS, SUFFIX_COLUMNS } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.constants";
import type { StageColumn } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.types";
import CandidateTable from "@/app/dashboard/hiring-requests-detail/components/candidate-table/candidate-table";
import ScheduleRoundModal from "@/app/dashboard/hiring-requests-detail/components/schedule-round/schedule-round-modal";
import AiInterviewScheduleModal from "@/app/dashboard/hiring-requests-detail/components/applicants/ai-interview-schedule-modal/ai-interview-schedule-modal";
import CancelInterviewModal from "@/app/dashboard/hiring-requests/components/interviews/cancel-interview-modal";
import { useApplicantActionHandlers } from "@/app/dashboard/hiring-requests-detail/components/applicants/hooks/use-applicant-action-handlers";
import ApplicantTimelineSheet from "@/app/dashboard/hiring-requests-detail/components/timeline/timeline";
import FinalVerdict from "@/app/dashboard/hiring-requests-detail/components/final-verdict/final-verdict";
import AdvanceTargetModal from "@/app/dashboard/hiring-requests-detail/components/modal/advance-target-modal";
import EditCandidateDetailsModal from "@/app/dashboard/hiring-requests-detail/components/modal/edit-candidate-details-modal";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import Skeleton from "@/components/ui/skeleton/skeleton";
import BulkArchiveModal from "@/app/dashboard/hiring-requests-detail/components/modal/bulk-archive-modal";
import { useApplicationsContext } from "@/app/dashboard/hiring-requests-detail/components/detail/applications-context";
import { useFilteredApplicants } from "@/app/dashboard/hiring-requests-detail/components/detail/use-filtered-applicants";
import type { InterviewTab, InterviewType, EvaluationRoundFilter } from "@/app/dashboard/hiring-requests-detail/components/detail/use-filtered-applicants";
import { useJobDetail } from "@/app/dashboard/hiring-requests-detail/components/detail/use-job-detail";
import { useBulkSelection } from "@/app/dashboard/hiring-requests-detail/components/detail/use-bulk-selection";
import { STAGE_FILTER_MAP, INTERVIEW_SUB_FILTER_MAP, EVALUATION_SUB_FILTER_MAP, EVALUATION_ROUND_FILTER_MAP, SCREENING_SUB_FILTER_MAP } from "@/app/dashboard/hiring-requests-detail/components/detail/detail.constants";
import { BULK_STAGE_CONFIG, isBulkAdvanceSubFilter, bulkSelectionKey } from "@/app/dashboard/hiring-requests-detail/components/detail/bulk-stage-config";
import InterviewFilterBar, { type InterviewScheduleFilter } from "@/app/dashboard/hiring-requests-detail/components/detail/interview-filter-bar";
import EvaluatedFilterBar, { type EvaluationSubFilter } from "@/app/dashboard/hiring-requests-detail/components/detail/evaluated-filter-bar";
import ScreeningFilterBar from "@/app/dashboard/hiring-requests-detail/components/detail/screening-filter-bar";
import PaginationBar from "@/components/ui/pagination-bar/pagination-bar";
import { fadeSlideUp, staggerContainer } from "@/utils/motion";
import type { JobDetailProps } from "./detail.types";
import { isRemoteLocation } from "@/utils/format-locations";

const JobDetail = ({ hiringRequest }: JobDetailProps) => {
  const [searchParams] = useSearchParams();
  const applicantParam = searchParams.get("applicant");
  const [interviewTab, setInterviewTab] = useState<InterviewTab>("incoming");
  const [interviewType, setInterviewType] = useState<InterviewType>("all");
  const [interviewScheduleFilter, setInterviewScheduleFilter] = useState<InterviewScheduleFilter>(null);
  const [evaluationSubFilter, setEvaluationSubFilter] = useState<EvaluationSubFilter>("evaluated");
  const [evaluationRoundFilter, setEvaluationRoundFilter] = useState<EvaluationRoundFilter>("all");
  const [screeningSubFilter, setScreeningSubFilter] = useState<"pending" | "completed" | "flagged">("pending");
  const jobId = hiringRequest.id;
  const isRemote =
    isRemoteLocation(hiringRequest.location) || hiringRequest.type?.toLowerCase() === "remote";
  const {
    applicants,
    isLoading: appsLoading,
    isRefreshing,
    total,
    page,
    totalPages,
    pageSize,
    goToPage,
    setPageSize,
    refresh,
    filter,
    scoreFilter,
    rejectReason,
    setFilter,
    setScoreFilter,
    setRejectReason,
    activeStage,
    setActiveStage,
    stageCounts,
    archivedStageCounts,
    finalizedTotal,
  } = useApplicationsContext();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  useJobDetail({
    applicantParam, applicants, appsLoading, page, totalPages, goToPage,
    onExpand: setExpandedId,
  });

  const filteredApplicants = useFilteredApplicants({
    applicants, activeStage, interviewTab, interviewType, evaluationSubFilter, evaluationRoundFilter, screeningSubFilter,
    interviewScheduleFilter,
  });

  const {
    modalProps,
    scheduleProps,
    rescheduleProps,
    aiScheduleProps,
    cancelProps,
    handleAction,
    handleMenuAction,
    getLocalApplicant,
    hiddenApplicantIds,
    advanceTargetProps,
  } = useApplicantActionHandlers({ data: filteredApplicants, jdId: jobId, onRefresh: refresh });

  const { can } = usePermissions();
  const canWorkflow = can(PERMISSIONS.APPLICATION_WORKFLOW);
  const bulkFlags = BULK_STAGE_CONFIG[activeStage];
  const showBulkSelection =
    canWorkflow &&
    !!bulkFlags &&
    isBulkAdvanceSubFilter(activeStage, screeningSubFilter, evaluationSubFilter);
  const bulkKey = bulkSelectionKey(activeStage, screeningSubFilter, evaluationSubFilter);
  const bulkSelection = useBulkSelection(jobId, filteredApplicants, refresh, showBulkSelection, bulkKey);
  const [timelineId, setTimelineId] = useState<number | null>(null);
  const [pendingArchive, setPendingArchive] = useState(false);
  const [editCandidate, setEditCandidate] = useState<Applicant | null>(null);

  useEffect(() => {
    setExpandedId(null);
  }, [activeStage]);

  useEffect(() => {
    if (page > 1) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const tableApplicants = useMemo(
    () =>
      filteredApplicants
        .map(getLocalApplicant)
        .filter((a) => !hiddenApplicantIds.has(a.id)),
    [filteredApplicants, getLocalApplicant, hiddenApplicantIds],
  );

  const stagesWithCounts = useMemo(() =>
    PIPELINE_STAGES.map((s) => {
      const evaluationCount =
        (stageCounts["waiting-evaluation"] ?? 0) + (stageCounts["evaluated"] ?? 0);
      const evaluationArchived =
        (archivedStageCounts["waiting-evaluation"] ?? 0) + (archivedStageCounts["evaluated"] ?? 0);
      return {
        ...s,
        count:
          s.key === "decision"
            ? finalizedTotal
            : s.key === "evaluation"
              ? evaluationCount
              : (stageCounts[s.key] ?? 0),
        archivedCount: s.key === "evaluation" ? evaluationArchived : (archivedStageCounts[s.key] ?? 0),
      };
    }),
    [stageCounts, archivedStageCounts, finalizedTotal],
  );

  const interviewCounts = useMemo(() => {
    const inStage = (a: (typeof applicants)[number]) => STAGE_FILTER_MAP["interview"](a);
    const incoming = applicants.filter((a) => inStage(a) && INTERVIEW_SUB_FILTER_MAP["incoming"](a)).length;
    const noShow = applicants.filter((a) => inStage(a) && INTERVIEW_SUB_FILTER_MAP["no-show"](a)).length;
    const ai = applicants.filter((a) => inStage(a) && INTERVIEW_SUB_FILTER_MAP["ai"](a)).length;
    const regular = applicants.filter((a) => inStage(a) && INTERVIEW_SUB_FILTER_MAP["regular"](a)).length;
    return {
      tabs: { incoming, "no-show": noShow },
      types: { all: incoming, ai, regular },
    };
  }, [applicants]);

  const columns = useMemo<StageColumn[]>(() => {
    if (activeStage === "screening") {
        return [
          { key: "name", label: "Candidate", flex: 2 },
          { key: "status", label: "Status", flex: 1 },
          { key: "round", label: "Current round", flex: 1.1 },
          { key: "actions", label: "Actions", flex: 1.6 },
        ];
    }
    if (activeStage === "interview") {
      if (interviewTab === "no-show") {
        return [...NAME_SCORE_STATUS, ...SUFFIX_COLUMNS];
      }
      return [
        ...NAME_SCORE_STATUS,
        { key: "startDate", label: "Start Date", flex: 0.9 },
        { key: "time", label: "Time", flex: 0.7 },
        ...SUFFIX_COLUMNS,
      ];
    }
    if (activeStage === "evaluation") {
      return [
        ...NAME_SCORE_STATUS,
        { key: "startDate", label: "Start Date", flex: 0.9 },
        { key: "time", label: "Time", flex: 0.7 },
        ...SUFFIX_COLUMNS,
      ];
    }
    const base = PIPELINE_STAGES.find((s) => s.key === activeStage)?.columns ?? [];
    return base;
  }, [activeStage, interviewTab]);

  const evaluationSubCounts = useMemo(() => ({
    evaluated: applicants.filter(STAGE_FILTER_MAP.evaluated).length,
    pending: applicants.filter(STAGE_FILTER_MAP["waiting-evaluation"]).length,
  }), [applicants]);

  const evaluationRoundCounts = useMemo(() => {
    const inSubFilter = applicants.filter(
      EVALUATION_SUB_FILTER_MAP[evaluationSubFilter] ?? (() => true),
    );
    return {
      all: inSubFilter.length,
      ai: inSubFilter.filter(EVALUATION_ROUND_FILTER_MAP.ai).length,
      regular: inSubFilter.filter(EVALUATION_ROUND_FILTER_MAP.regular).length,
    };
  }, [applicants, evaluationSubFilter]);

  const screeningSubCounts = useMemo(() => ({
    pending: applicants.filter(
      (a) => STAGE_FILTER_MAP["screening"](a) && SCREENING_SUB_FILTER_MAP["pending"](a),
    ).length,
    completed: applicants.filter(
      (a) => STAGE_FILTER_MAP["screening"](a) && SCREENING_SUB_FILTER_MAP["completed"](a),
    ).length,
    flagged: applicants.filter(
      (a) => STAGE_FILTER_MAP["screening"](a) && SCREENING_SUB_FILTER_MAP["flagged"](a),
    ).length,
  }), [applicants]);

  const showBulkBar = showBulkSelection && bulkSelection.selectionCount > 0;

  return (
    <div className="job-page">
      <PipelineStages stages={stagesWithCounts} activeKey={activeStage} onStageChange={setActiveStage} />
      <motion.div className="tab-content" variants={staggerContainer} initial="hidden" animate="visible">
        {activeStage === "decision" ? (
        <ErrorBoundary>
          <FinalVerdict jobId={jobId} isRemote={isRemote} />
        </ErrorBoundary>
        ) : (
        <ErrorBoundary>
          {showBulkBar && (
            <div className="bulk-action-bar">
              {bulkSelection.isBulkProcessing ? (
                <div className="bulk-action-skeleton">
                  <Skeleton variant="text" width="260px" height="14px" className="bulk-action-skeleton-count" />
                  <div className="bulk-action-skeleton-buttons">
                    <Skeleton variant="rect" width="160px" height="34px" borderRadius="6px" />
                    <Skeleton variant="rect" width="160px" height="34px" borderRadius="6px" />
                    <Skeleton variant="rect" width="98px" height="34px" borderRadius="6px" />
                  </div>
                </div>
              ) : (
                <>
              <span className="bulk-action-count">{bulkSelection.selectionCount} candidate{bulkSelection.selectionCount !== 1 ? "s" : ""} selected</span>
              <div className="bulk-action-buttons">
                {canWorkflow && bulkFlags?.aiScreening && (
                  <button
                    className="btn screen-btn compact"
                    onClick={() => { void bulkSelection.handleBulkMoveToScreening(); }}
                    disabled={bulkSelection.isBulkProcessing}
                    type="button"
                  >
                    {bulkSelection.activeAction === "screening" ? <i className="bx bx-loader-alt bx-spin" /> : <i className="bx bx-phone" />}
                    {" "}Move to AI screening
                  </button>
                )}
                {canWorkflow && bulkFlags?.aiInterview && (
                  <button
                    className="btn screen-btn compact"
                    onClick={() => { void bulkSelection.handleBulkMoveToInterview(); }}
                    disabled={bulkSelection.isBulkProcessing}
                    type="button"
                  >
                    {bulkSelection.activeAction === "interview" ? <i className="bx bx-loader-alt bx-spin" /> : <i className="bx bx-calendar" />}
                    {" "}Schedule AI interview
                  </button>
                )}
                {canWorkflow && bulkFlags?.archive && (
                  <button
                    className="btn screen-btn compact bulk-archive-btn"
                    onClick={() => setPendingArchive(true)}
                    disabled={bulkSelection.isBulkProcessing}
                    type="button"
                  >
                    {bulkSelection.activeAction === "archive" ? <i className="bx bx-loader-alt bx-spin" /> : <i className="bx bx-archive" />}
                    {" "}Archive
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
                </>
              )}
            </div>
          )}

          {activeStage === "resume-shortlisting" && (
            <ApplicantFilters
              filter={filter} onFilterChange={setFilter}
              scoreFilter={scoreFilter} onScoreFilterChange={setScoreFilter}
              rejectReason={rejectReason} onRejectReasonChange={setRejectReason}
            />
          )}
          {activeStage === "screening" && (
            <ScreeningFilterBar value={screeningSubFilter} onChange={setScreeningSubFilter} counts={screeningSubCounts} />
          )}
          {activeStage === "interview" && (
            <InterviewFilterBar
              tab={interviewTab}
              onTabChange={(v) => {
                setInterviewTab(v);
                if (v !== "incoming") setInterviewScheduleFilter(null);
              }}
              counts={interviewCounts.tabs}
              type={interviewType}
              onTypeChange={setInterviewType}
              typeCounts={interviewCounts.types}
              scheduleFilter={interviewScheduleFilter}
              onScheduleFilterChange={setInterviewScheduleFilter}
            />
          )}
          {activeStage === "evaluation" && (
            <EvaluatedFilterBar
              value={evaluationSubFilter}
              onChange={setEvaluationSubFilter}
              counts={evaluationSubCounts}
              roundFilter={evaluationRoundFilter}
              onRoundFilterChange={setEvaluationRoundFilter}
              roundCounts={evaluationRoundCounts}
            />
          )}

          <motion.div
            variants={fadeSlideUp}
            className={isRefreshing ? "candidate-list--refreshing" : undefined}
          >
            <CandidateTable
              data={tableApplicants}
              columns={columns}
              onRowClick={(candidate) => setExpandedId((prev) => (prev === candidate.id ? null : candidate.id))}
              onAction={handleAction}
              onMenuAction={handleMenuAction}
              onEditDetails={setEditCandidate}
              onTimelineOpen={(candidate) => setTimelineId(candidate.candidateId)}
              showBulkSelection={showBulkSelection}
              selectedIds={bulkSelection.selectedIds}
              onToggleSelect={bulkSelection.toggleSelect}
              onToggleSelectAll={bulkSelection.toggleSelectAll}
              allSelected={bulkSelection.allSelected}
              activeStage={activeStage}
              loading={appsLoading}
              hiringRequestId={jobId}
              onScreeningTriggered={refresh}
              expandedId={expandedId}
              isRemote={isRemote}
            />
            <PaginationBar
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={pageSize}
              onPageChange={goToPage}
              onPageSizeChange={setPageSize}
            />
          </motion.div>
        </ErrorBoundary>
        )}

        <BulkArchiveModal
          open={pendingArchive}
          count={bulkSelection.selectionCount}
          onClose={() => setPendingArchive(false)}
          onConfirm={() => {
            setPendingArchive(false);
            bulkSelection.handleBulkArchive(true);
          }}
        />

        <ApplicantTimelineSheet openId={timelineId} onClose={() => setTimelineId(null)} />

        <ApplicantActionModals {...modalProps} />

        <AdvanceTargetModal
          open={advanceTargetProps.open}
          candidateName={advanceTargetProps.candidateName}
          onClose={advanceTargetProps.onClose}
          onChoose={advanceTargetProps.onChoose}
        />

        <ScheduleRoundModal
          open={!!scheduleProps.candidateId}
          candidateName={scheduleProps.candidateName}
          candidateId={scheduleProps.candidateId ?? ""}
          candidateNumberId={scheduleProps.candidateNumberId}
          jdId={jobId}
          hiringRequestId={jobId}
          onClose={scheduleProps.onClose}
          onScheduled={scheduleProps.onScheduled}
        />

        <ScheduleRoundModal
          open={!!rescheduleProps.target}
          rescheduleMode
          candidateName={rescheduleProps.target?.name ?? ""}
          candidateId={rescheduleProps.target?.id ?? ""}
          interviewId={rescheduleProps.target?.interviewId}
          interviewerEmpId={rescheduleProps.target?.interviewerEmpId}
          interviewerName={rescheduleProps.target?.interviewerName}
          roundName={rescheduleProps.target?.roundName}
          jdId={jobId}
          hiringRequestId={jobId}
          onClose={rescheduleProps.onClose}
          onScheduled={rescheduleProps.onScheduled}
        />

        <AiInterviewScheduleModal
          key={aiScheduleProps.target?.id ?? "ai-schedule-closed"}
          open={!!aiScheduleProps.target}
          candidateName={aiScheduleProps.target?.name ?? ""}
          candidateId={aiScheduleProps.target?.candidateId ?? 0}
          hiringRequestId={jobId}
          currentSlot={aiScheduleProps.target?.currentSlot}
          onClose={aiScheduleProps.onClose}
          onScheduled={aiScheduleProps.onScheduled}
        />

        <CancelInterviewModal
          open={!!cancelProps.target}
          interviewId={cancelProps.target?.interviewId ?? ""}
          candidateName={cancelProps.target?.name ?? ""}
          onClose={cancelProps.onClose}
          onConfirm={cancelProps.onConfirm}
        />

        <EditCandidateDetailsModal
          open={!!editCandidate}
          applicant={editCandidate}
          onClose={() => setEditCandidate(null)}
        />
      </motion.div>
    </div>
  );
};

export default JobDetail;
