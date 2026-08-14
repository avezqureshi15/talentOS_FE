import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PipelineStages from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages";
import CandidateTable from "@/app/dashboard/hiring-requests-detail/components/candidate-table/candidate-table";
import Applicants from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants";
import ApplicantTimelineSheet from "@/app/dashboard/hiring-requests-detail/components/timeline/timeline";
import ApplicantActionModals from "@/app/dashboard/hiring-requests-detail/components/applicants/applicant-action-modals";
import ScheduleRoundModal from "@/app/dashboard/hiring-requests-detail/components/schedule-round/schedule-round-modal";
import AiInterviewScheduleModal from "@/app/dashboard/hiring-requests-detail/components/applicants/ai-interview-schedule-modal/ai-interview-schedule-modal";
import CancelInterviewModal from "@/app/dashboard/hiring-requests/components/interviews/cancel-interview-modal";
import { useApplicantActionHandlers } from "@/app/dashboard/hiring-requests-detail/components/applicants/hooks/use-applicant-action-handlers";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import Skeleton from "@/components/ui/skeleton/skeleton";
import { useFinalizedData } from "@/app/dashboard/hiring-requests-detail/components/detail/use-applications-data";
import { useBulkSelection } from "@/app/dashboard/hiring-requests-detail/components/detail/use-bulk-selection";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/constants/permissions";
import BulkArchiveModal from "@/app/dashboard/hiring-requests-detail/components/modal/bulk-archive-modal";
import { DEFAULT_FILTER, UI_TABLE_VIEW, UI_CARD_VIEW } from "@/app/dashboard/hiring-requests-detail/components/detail/detail.constants";
import { springSnap, fadeSlideUp, staggerContainer } from "@/utils/motion";
import { DECISION_STAGES, STAGE_FILTER } from "./decision-board.constants";
import type { DecisionStageKey } from "./decision-board.types";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";
import type { StageKey } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.types";
import "../detail/detail.css";
import "./decision-board.css";

type Props = {
  jobId: string;
};

const DecisionBoard = ({ jobId }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"table" | "card">(
    (searchParams.get("view") as "table" | "card") ?? "table"
  );
  const [activeStage, setActiveStage] = useState<DecisionStageKey>("selected");
  const [openId, setOpenId] = useState<string | null>(null);
  const [timelineId, setTimelineId] = useState<number | null>(null);

  useEffect(
    () => {
      const view = searchParams.get("view");
      if (view === "card" || view === "table") setViewMode(view);
    },
    // Sync view mode from URL search params
    [searchParams],
  );

  const { applicants, isLoading: appsLoading, refresh } = useFinalizedData(jobId, true);

  const filteredApplicants = useMemo(
    () => applicants.filter(STAGE_FILTER[activeStage]),
    [applicants, activeStage],
  );

  const {
    modalProps,
    scheduleProps,
    rescheduleProps,
    aiScheduleProps,
    cancelProps,
    handleAction,
    handleMenuAction,
    getLocalApplicant,
  } = useApplicantActionHandlers({ data: filteredApplicants, jdId: jobId, onRefresh: refresh });

  const { can } = usePermissions();
  const canWorkflow = can(PERMISSIONS.APPLICATION_WORKFLOW);
  const bulkSelection = useBulkSelection(jobId, filteredApplicants, refresh, canWorkflow);
  const [pendingArchive, setPendingArchive] = useState(false);

  const stagesWithCounts = useMemo(() =>
    DECISION_STAGES.map((s) => ({
      ...s,
      count: applicants.filter(STAGE_FILTER[s.key]).length,
      columns: s.columns,
      subItems: undefined,
    })),
    [applicants],
  );

  const handleInfoClick = (candidate: Applicant) => {
    setSearchParams({ applicant: candidate.id, view: "card" });
  };

  return (
    <div className="job-page">
      <PipelineStages
        stages={stagesWithCounts}
        activeKey={activeStage}
        onStageChange={(k: StageKey) => setActiveStage(k as DecisionStageKey)}
      />
      <motion.div className="tab-content" variants={staggerContainer} initial="hidden" animate="visible">
        <ErrorBoundary>
          {canWorkflow && bulkSelection.selectionCount > 0 && (
            <div className="bulk-action-bar">
              {bulkSelection.isBulkProcessing ? (
                <div className="bulk-action-skeleton">
                  <Skeleton variant="text" width="220px" height="14px" className="bulk-action-skeleton-count" />
                  <div className="bulk-action-skeleton-buttons">
                    <Skeleton variant="rect" width="98px" height="34px" borderRadius="6px" />
                  </div>
                </div>
              ) : (
                <>
              <span className="bulk-action-count">{bulkSelection.selectionCount} candidate{bulkSelection.selectionCount !== 1 ? "s" : ""} selected</span>
              <div className="bulk-action-buttons">
                <button
                  className="btn screen-btn compact bulk-archive-btn"
                  onClick={() => setPendingArchive(true)}
                  disabled={bulkSelection.isBulkProcessing}
                  type="button"
                >
                  {bulkSelection.isBulkProcessing ? <i className="bx bx-loader-alt bx-spin" /> : <i className="bx bx-archive" />}
                  {" "}Archive
                </button>
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
          <div className="persistent-view-toggle">
            <div className="segmented-control">
              <motion.button
                className={`view-toggle-icon${viewMode === "table" ? " view-toggle-icon--active" : ""}`}
                onClick={() => setViewMode("table")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={springSnap}
              >
                <i className="bx bx-border-all" />
                <span className="view-toggle-label">{UI_TABLE_VIEW}</span>
              </motion.button>
              <motion.button
                className={`view-toggle-icon${viewMode === "card" ? " view-toggle-icon--active" : ""}`}
                onClick={() => setViewMode("card")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={springSnap}
              >
                <i className="bx bx-grid" />
                <span className="view-toggle-label">{UI_CARD_VIEW}</span>
              </motion.button>
            </div>
          </div>

          {viewMode === "card" ? (
            <AnimatePresence>
              {appsLoading ? (
                <motion.div variants={fadeSlideUp}><LoadingSpinner /></motion.div>
              ) : (
                <motion.div variants={fadeSlideUp}>
                  <Applicants
                    data={filteredApplicants}
                    openId={openId}
                    setOpenId={setOpenId}
                    filter={DEFAULT_FILTER}
                    onFilterChange={() => {}}
                    rejectReason=""
                    onRejectReasonChange={() => {}}
                    onRefresh={refresh}
                    jdId={jobId}
                    isRemote={false}
                    showBulkSelection={canWorkflow}
                    selectedIds={bulkSelection.selectedIds}
                    onToggleSelect={bulkSelection.toggleSelect}
                    onToggleSelectAll={bulkSelection.toggleSelectAll}
                    allSelected={bulkSelection.allSelected}
                    selectionCount={bulkSelection.selectionCount}
                    timelineId={timelineId}
                    onTimeline={setTimelineId}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <motion.div variants={fadeSlideUp}>
              <CandidateTable
                data={filteredApplicants.map(getLocalApplicant)}
                columns={DECISION_STAGES.find((s) => s.key === activeStage)?.columns ?? []}
                onInfoClick={handleInfoClick}
                onAction={handleAction}
                onMenuAction={handleMenuAction}
                onTimelineOpen={(candidate) => setTimelineId(candidate.candidateId)}
                showBulkSelection={canWorkflow}
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
      </motion.div>
    </div>
  );
};

export default DecisionBoard;
