import { useState } from "react";
import ApplicantCard from "./applicant-card";
import ApplicantActionModals from "./applicant-action-modals";
import CoverLetterModal from "@/app/dashboard/hiring-requests-detail/components/modal/cover-letter-modal";
import AiSummaryModal from "@/app/dashboard/hiring-requests-detail/components/modal/ai-summary-modal";
import ApplicantDetailsModal from "@/app/dashboard/hiring-requests-detail/components/modal/applicant-details-modal";
import ScheduleRoundModal from "@/app/dashboard/hiring-requests-detail/components/schedule-round/schedule-round-modal";
import AiInterviewScheduleModal from "@/app/dashboard/hiring-requests-detail/components/applicants/ai-interview-schedule-modal/ai-interview-schedule-modal";
import CancelInterviewModal from "@/app/dashboard/hiring-requests/components/interviews/cancel-interview-modal";
import { useApplicantActionHandlers } from "./hooks/use-applicant-action-handlers";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/constants/permissions";
import type { AccordionTab, ApplicantsProps } from "./applicants.types";

function Applicants({ data: propData, openId, setOpenId, applicantParam, onRefresh, jdId, isRemote, showBulkSelection = false, selectedIds, onToggleSelect, onToggleSelectAll, allSelected, selectionCount = 0, onTimeline }: ApplicantsProps) {
  const { can } = usePermissions();
  const canWorkflow = can(PERMISSIONS.APPLICATION_WORKFLOW);
  const [accordionTab, setAccordionTab] = useState<AccordionTab>("details");
  const [coverLetterId, setCoverLetterId] = useState<string | null>(null);
  const [aiSummaryId, setAiSummaryId] = useState<string | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);

  const data = propData ?? [];

  const {
    modalProps,
    scheduleProps,
    rescheduleProps,
    aiScheduleProps,
    cancelProps,
    handleAction,
    handleMenuAction,
    getLocalApplicant,
    retryingScreeningId,
  } = useApplicantActionHandlers({
    data,
    jdId,
    onRefresh,
    onMoveToNextRoundSideEffect: (id) => setOpenId(id),
  });

  return (
    <>
      <div className="accordion-list">
        {showBulkSelection && (
          <div className="bulk-select-header">
            <i
              className={`bx ${allSelected ? "bx-checkbox-checked" : "bx-checkbox"} applicant-checkbox`}
              onClick={onToggleSelectAll}
            />
            <span className="bulk-select-label">Select All</span>
            {selectionCount > 0 && (
              <span className="bulk-select-count">{selectionCount} candidate{selectionCount !== 1 ? "s" : ""} selected</span>
            )}
          </div>
        )}
        {data.map((a) => {
          const isOpen = openId === a.id;
          const merged = getLocalApplicant(a);
          return (
            <div key={a.id} data-applicant-id={a.id} data-highlight={applicantParam === a.id ? "true" : undefined}>
              {canWorkflow && merged.stage === "AI_SCREENING" && merged.status?.toLowerCase() !== "ai_screening_evaluation_failed" && merged.status?.toLowerCase() !== "ai_screening_flagged" && merged.status?.toLowerCase() !== "under_evaluation" && (
                <div className="ai-retry-row">
                  <button
                    className="action-link action-link-btn"
                    onClick={(e) => { e.stopPropagation(); handleAction("onRetryAiScreening", a.id); }}
                    disabled={retryingScreeningId === a.id}
                    type="button"
                  >
                    {retryingScreeningId === a.id ? "Re-running AI screening..." : "Re-run AI screening"}
                  </button>
                </div>
              )}
              <ApplicantCard
                applicant={merged}
                isOpen={isOpen}
                isScreening={false}
                showCheckbox={showBulkSelection}
                isSelected={selectedIds?.has(a.id)}
                onToggleSelect={onToggleSelect}
                accordionTab={accordionTab}
                onToggleOpen={(id) => {
                  if (isOpen) { setOpenId(null); } else { setOpenId(id); setAccordionTab("details"); }
                }}
                onAction={handleAction}
                onMenuAction={handleMenuAction}
                onTabChange={setAccordionTab}
                onCoverLetterReadMore={setCoverLetterId}
                onAiSummaryReadMore={setAiSummaryId}
                onDetailsReadMore={setDetailsId}
                onTimeline={onTimeline}
                jdId={jdId}
                isRemote={isRemote}
              />
            </div>
          );
        })}

        <ApplicantActionModals {...modalProps} />

        <ScheduleRoundModal
          open={!!scheduleProps.candidateId}
          candidateName={scheduleProps.candidateName}
          candidateId={scheduleProps.candidateId ?? ""}
          candidateNumberId={scheduleProps.candidateNumberId}
          jdId={jdId}
          hiringRequestId={jdId}
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
          jdId={jdId}
          hiringRequestId={jdId}
          onClose={rescheduleProps.onClose}
          onScheduled={rescheduleProps.onScheduled}
        />

        <AiInterviewScheduleModal
          key={aiScheduleProps.target?.id ?? "ai-schedule-closed"}
          open={!!aiScheduleProps.target}
          candidateName={aiScheduleProps.target?.name ?? ""}
          candidateId={aiScheduleProps.target?.candidateId ?? 0}
          hiringRequestId={jdId}
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

        {data.map((a) => (<CoverLetterModal key={`cl-${a.id}`} open={coverLetterId === a.id} applicantName={a.name} coverLetter={a.coverLetter ?? ""} onClose={() => setCoverLetterId(null)} />))}
        {data.map((a) => (<AiSummaryModal key={`ai-${a.id}`} open={aiSummaryId === a.id} applicantName={a.name} aiSummary={a.aiSummary ?? ""} onClose={() => setAiSummaryId(null)} />))}
        {data.map((a) => (
          <ApplicantDetailsModal
            key={`det-${a.id}`}
            open={detailsId === a.id}
            applicantName={a.name}
            details={{ currentCtc: a.currentCtc, expectedCtc: a.expectedCtc, location: a.location, yearsOfExperience: a.yearsOfExperience, noticePeriod: a.noticePeriod, howDidYouHear: a.howDidYouHear, willingToRelocate: a.willingToRelocate === true ? "Yes" : a.willingToRelocate === false ? "No" : undefined }}
            onClose={() => setDetailsId(null)}
            isRemote={isRemote}
          />
        ))}
      </div>
    </>
  );
}

export default Applicants;
