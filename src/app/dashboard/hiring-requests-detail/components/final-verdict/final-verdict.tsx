import { useState } from "react";
import { useApplicationsData } from "@/app/dashboard/hiring-requests-detail/components/detail/use-applications-data";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ApplicantTimelineSheet from "@/app/dashboard/hiring-requests-detail/components/timeline/timeline";
import CoverLetterModal from "@/app/dashboard/hiring-requests-detail/components/modal/cover-letter-modal";
import AiSummaryModal from "@/app/dashboard/hiring-requests-detail/components/modal/ai-summary-modal";
import ApplicantDetailsModal from "@/app/dashboard/hiring-requests-detail/components/modal/applicant-details-modal";
import RoundsSidePanel from "@/app/dashboard/hiring-requests-detail/components/rounds-side-panel/rounds-side-panel";
import { FINAL_VERDICT_SUB_TABS } from "./final-verdict.constants";
import type { FinalVerdictProps, FinalVerdictSubTab } from "./final-verdict.types";
import type { AccordionTab, InterviewRound } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";
import FvCard from "./fv-card";
import "./final-verdict.css";

const FinalVerdict = ({ jobId }: FinalVerdictProps) => {
  const [subTab, setSubTab] = useState<FinalVerdictSubTab>("selected");
  const [openId, setOpenId] = useState<string | null>(null);
  const [accordionTab, setAccordionTab] = useState<AccordionTab>("details");
  const [timelineId, setTimelineId] = useState<string | null>(null);
  const [coverLetterId, setCoverLetterId] = useState<string | null>(null);
  const [aiSummaryId, setAiSummaryId] = useState<string | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [selectedRound, setSelectedRound] = useState<InterviewRound | null>(null);

  const filter = subTab === "selected" ? "hired" : "rejected";
  const { applicants, isLoading, hasMore, fetchNext } = useApplicationsData(
    jobId,
    filter,
    true,
  );

  return (
    <div className="final-verdict">
      <div className="fv-sub-tabs">
        {FINAL_VERDICT_SUB_TABS.map((st) => (
          <button
            key={st.key}
            className={`fv-sub-tab${subTab === st.key ? " fv-sub-tab--active" : ""}`}
            onClick={() => setSubTab(st.key)}
            type="button"
          >
            <i className={st.icon} />
            {st.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : applicants.length === 0 ? (
        <div className="hr-tab-placeholder">No {subTab} candidates</div>
      ) : (
        <>
          <div className="fv-card-grid">
            {applicants.map((a) => (
              <FvCard
                key={a.id}
                applicant={a}
                isOpen={openId === a.id}
                accordionTab={accordionTab}
                onToggleOpen={(id) => {
                  if (openId === id) { setOpenId(null); } else { setOpenId(id); setAccordionTab("details"); }
                }}
                onTabChange={setAccordionTab}
                onCoverLetterReadMore={setCoverLetterId}
                onAiSummaryReadMore={setAiSummaryId}
                onDetailsReadMore={setDetailsId}
                onTimeline={setTimelineId}
                onViewRound={setSelectedRound}
              />
            ))}
            {hasMore && (
              <button className="screen-btn" onClick={fetchNext} type="button">Load More</button>
            )}
          </div>

          <ApplicantTimelineSheet openId={timelineId} onClose={() => setTimelineId(null)} />

          {applicants.map((a) => (
            <CoverLetterModal
              key={`cl-${a.id}`}
              open={coverLetterId === a.id}
              applicantName={a.name}
              coverLetter={a.coverLetter ?? ""}
              onClose={() => setCoverLetterId(null)}
            />
          ))}

          {applicants.map((a) => (
            <AiSummaryModal
              key={`ai-${a.id}`}
              open={aiSummaryId === a.id}
              applicantName={a.name}
              aiSummary={a.aiSummary ?? ""}
              onClose={() => setAiSummaryId(null)}
            />
          ))}

          <RoundsSidePanel
            open={!!selectedRound}
            round={selectedRound}
            onClose={() => setSelectedRound(null)}
          />

          {applicants.map((a) => (
            <ApplicantDetailsModal
              key={`det-${a.id}`}
              open={detailsId === a.id}
              applicantName={a.name}
              details={{
                currentCtc: a.currentCtc,
                expectedCtc: a.expectedCtc,
                location: a.location,
                yearsOfExperience: a.yearsOfExperience,
                noticePeriod: a.noticePeriod,
                howDidYouHear: a.howDidYouHear,
                willingToRelocate: a.willingToRelocate === true ? "Yes" : a.willingToRelocate === false ? "No" : undefined,
              }}
              onClose={() => setDetailsId(null)}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default FinalVerdict;
