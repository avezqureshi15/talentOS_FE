import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PipelineStages from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages";
import CandidateTable from "@/app/dashboard/hiring-requests-detail/components/candidate-table/candidate-table";
import Applicants from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import { useFinalizedData } from "@/app/dashboard/hiring-requests-detail/components/detail/use-applications-data";
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

  useEffect(
    () => {
      const view = searchParams.get("view");
      if (view === "card" || view === "table") setViewMode(view);
    },
    // Sync view mode from URL search params
    [searchParams],
  );

  const { applicants, isLoading: appsLoading, refresh } = useFinalizedData(jobId, true);
  const hasMore = false;
  const fetchNext = () => {};

  const stagesWithCounts = useMemo(() =>
    DECISION_STAGES.map((s) => ({
      ...s,
      count: applicants.filter(STAGE_FILTER[s.key]).length,
      columns: s.columns,
      subItems: undefined,
    })),
    [applicants],
  );

  const filteredApplicants = useMemo(
    () => applicants.filter(STAGE_FILTER[activeStage]),
    [applicants, activeStage],
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
                    openId={null}
                    setOpenId={() => {}}
                    filter={DEFAULT_FILTER}
                    onFilterChange={() => {}}
                    hasMore={hasMore}
                    onLoadMore={fetchNext}
                    rejectReason=""
                    onRejectReasonChange={() => {}}
                    onRefresh={refresh}
                    jdId={jobId}
                    isRemote={false}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <motion.div variants={fadeSlideUp}>
              <CandidateTable
                data={filteredApplicants}
                columns={DECISION_STAGES.find((s) => s.key === activeStage)?.columns ?? []}
                onInfoClick={handleInfoClick}
                loading={appsLoading}
              />
            </motion.div>
          )}
        </ErrorBoundary>
      </motion.div>
    </div>
  );
};

export default DecisionBoard;
