import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import "./detail.css";

import Applicants from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants";
import ApplicantFilters from "@/app/dashboard/hiring-requests-detail/components/applicants/applicant-filters";
import PipelineStages from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages";
import { PIPELINE_STAGES } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.constants";
import type { StageKey } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.types";
import CandidateTable from "@/app/dashboard/hiring-requests-detail/components/candidate-table/candidate-table";
import InterviewsTable from "@/app/dashboard/hiring-requests-detail/components/interviews-table/interviews-table";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import { useApplicationsContext } from "@/app/dashboard/hiring-requests-detail/components/detail/applications-context";
import { useFilteredApplicants } from "@/app/dashboard/hiring-requests-detail/components/detail/use-filtered-applicants";
import { useJobDetail } from "@/app/dashboard/hiring-requests-detail/components/detail/use-job-detail";
import { DEFAULT_FILTER, STAGE_FILTER_MAP, UI_SEARCHING_APPLICANT, UI_APPLICANT_NOT_FOUND } from "@/app/dashboard/hiring-requests-detail/components/detail/detail.constants";
import ViewToggle from "@/app/dashboard/hiring-requests-detail/components/detail/view-toggle";
import InterviewFilterBar from "@/app/dashboard/hiring-requests-detail/components/detail/interview-filter-bar";
import EvaluatedFilterBar from "@/app/dashboard/hiring-requests-detail/components/detail/evaluated-filter-bar";
import { fadeSlideUp, staggerContainer } from "@/utils/motion";
import type { JobDetailProps } from "./detail.types";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

const JobDetail = ({ hiringRequest }: JobDetailProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const applicantParam = searchParams.get("applicant");
  const [activeStage, setActiveStage] = useState<StageKey>("resume-shortlisting");
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  const [rejectReason, setRejectReason] = useState<string>("");
  const [interviewSubFilter, setInterviewSubFilter] = useState<"yet-to-start" | "no-show">("yet-to-start");
  const [evaluatedSubFilter, setEvaluatedSubFilter] = useState<"ai" | "regular">("ai");

  const jobId = hiringRequest.id;
  const isRemote = hiringRequest.location?.toLowerCase() === "remote" || hiringRequest.type?.toLowerCase() === "remote";
  const { applicants, isLoading: appsLoading, isLoadingMore, hasMore, fetchNext, refresh, interviewCount } = useApplicationsContext();

  const { viewMode, setViewMode, openId, setOpenId, handleRowClick, handleInfoClick, isSearchingForApplicant } = useJobDetail({
    applicantParam, applicants, appsLoading, isLoadingMore, hasMore, fetchNext, jobId,
  });

  const filteredApplicants = useFilteredApplicants({
    applicants, activeStage, scoreFilter, rejectReason, interviewSubFilter, evaluatedSubFilter,
  });

  const stagesWithCounts = useMemo(() =>
    PIPELINE_STAGES.map((s) => ({
      ...s,
      count: s.key === "interview" ? interviewCount : applicants.filter(STAGE_FILTER_MAP[s.key]).length,
    })),
    [applicants, interviewCount],
  );

  return (
    <div className="job-page">
      <PipelineStages stages={stagesWithCounts} activeKey={activeStage} onStageChange={setActiveStage} />
      <motion.div className="tab-content" variants={staggerContainer} initial="hidden" animate="visible">
        <ErrorBoundary>
          <ViewToggle viewMode={viewMode} onChange={setViewMode} />

          {activeStage === "resume-shortlisting" && (
            <ApplicantFilters
              filter={filter} onFilterChange={setFilter}
              scoreFilter={scoreFilter} onScoreFilterChange={setScoreFilter}
              rejectReason={rejectReason} onRejectReasonChange={setRejectReason}
            />
          )}
          {activeStage === "interview" && (
            <InterviewFilterBar value={interviewSubFilter} onChange={setInterviewSubFilter} />
          )}
          {activeStage === "interview" && <div className="filter-chips" />}
          {activeStage === "evaluated" && (
            <EvaluatedFilterBar value={evaluatedSubFilter} onChange={setEvaluatedSubFilter} />
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
                  />
                </motion.div>
              )}
            </>
          ) : activeStage === "interview" ? (
            <motion.div variants={fadeSlideUp}>
              <InterviewsTable hiringRequestId={jobId} subTab={interviewSubFilter} onInfoClick={(cid) => setSearchParams({ applicant: cid, view: "card" })} />
            </motion.div>
          ) : (
            <motion.div variants={fadeSlideUp}>
              <CandidateTable
                data={filteredApplicants}
                columns={PIPELINE_STAGES.find((s) => s.key === activeStage)?.columns ?? []}
                onRowClick={(candidate) => handleRowClick(candidate as Applicant)}
                onInfoClick={(candidate) => handleInfoClick(candidate as Applicant)}
              />
            </motion.div>
          )}
        </ErrorBoundary>
      </motion.div>
    </div>
  );
};

export default JobDetail;
