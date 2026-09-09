import { useState } from "react";
import { motion } from "framer-motion";
import CandidateTable from "@/app/dashboard/hiring-requests-detail/components/candidate-table/candidate-table";
import ApplicantTimelineSheet from "@/app/dashboard/hiring-requests-detail/components/timeline/timeline";
import ApplicantActionModals from "@/app/dashboard/hiring-requests-detail/components/applicants/applicant-action-modals";
import { useApplicantActionHandlers } from "@/app/dashboard/hiring-requests-detail/components/applicants/hooks/use-applicant-action-handlers";
import { PIPELINE_STAGES } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.constants";
import PaginationBar from "@/components/ui/pagination-bar/pagination-bar";
import { fadeSlideUp } from "@/utils/motion";
import FinalVerdictFilterBar from "./final-verdict-filter-bar";
import { useFinalVerdictsData } from "./hooks/use-final-verdicts-data";
import { useFinalVerdictCounts } from "./hooks/use-final-verdict-counts";
import type { FinalVerdictProps, FinalVerdictSubTab } from "./final-verdict.types";
import "./final-verdict.css";

const DECISION_COLUMNS = PIPELINE_STAGES.find((s) => s.key === "decision")?.columns ?? [];

const FinalVerdict = ({ jobId, isRemote = false }: FinalVerdictProps) => {
  const [subTab, setSubTab] = useState<FinalVerdictSubTab>("selected");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [timelineId, setTimelineId] = useState<number | null>(null);

  const {
    candidates,
    isLoading,
    total,
    page,
    totalPages,
    pageSize,
    goToPage,
    setPageSize,
    refresh,
  } = useFinalVerdictsData(subTab, jobId);
  const counts = useFinalVerdictCounts(jobId);

  const { modalProps, handleAction, handleMenuAction, getLocalApplicant } = useApplicantActionHandlers({
    data: candidates,
    jdId: jobId,
    onRefresh: refresh,
  });

  const tableApplicants = candidates.map(getLocalApplicant);

  return (
    <div className="final-verdict">
      <FinalVerdictFilterBar
        value={subTab}
        onChange={(next) => {
          setSubTab(next);
          setExpandedId(null);
        }}
        counts={counts}
      />

      <motion.div variants={fadeSlideUp}>
        <CandidateTable
          data={tableApplicants}
          columns={DECISION_COLUMNS}
          onRowClick={(candidate) => setExpandedId((prev) => (prev === candidate.id ? null : candidate.id))}
          onAction={handleAction}
          onMenuAction={handleMenuAction}
          onTimelineOpen={(candidate) => setTimelineId(candidate.candidateId)}
          activeStage="decision"
          loading={isLoading}
          hiringRequestId={jobId}
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

      <ApplicantActionModals {...modalProps} />
      <ApplicantTimelineSheet openId={timelineId} onClose={() => setTimelineId(null)} />
    </div>
  );
};

export default FinalVerdict;
