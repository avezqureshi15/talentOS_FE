import { useState } from "react";
import ApplicantCard from "@/app/dashboard/hiring-requests-detail/components/applicants/applicant-card";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ApplicantTimelineSheet from "@/app/dashboard/hiring-requests-detail/components/timeline/timeline";
import CoverLetterModal from "@/app/dashboard/hiring-requests-detail/components/modal/cover-letter-modal";
import AiSummaryModal from "@/app/dashboard/hiring-requests-detail/components/modal/ai-summary-modal";
import ApplicantDetailsModal from "@/app/dashboard/hiring-requests-detail/components/modal/applicant-details-modal";
import RoundsSidePanel from "@/app/dashboard/hiring-requests-detail/components/rounds-side-panel/rounds-side-panel";
import { FINAL_VERDICT_SUB_TABS } from "./final-verdict.constants";
import { useFinalVerdictsData } from "./hooks/use-final-verdicts-data";
import type { FinalVerdictProps, FinalVerdictSubTab } from "./final-verdict.types";
import type { AccordionTab } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";
import "./final-verdict.css";

const FinalVerdict = ({ jobId: _jobId }: FinalVerdictProps) => {
  const [subTab, setSubTab] = useState<FinalVerdictSubTab>("selected");
  const [openId, setOpenId] = useState<string | null>(null);
  const [accordionTab, setAccordionTab] = useState<AccordionTab>("details");
  const [timelineId, setTimelineId] = useState<string | null>(null);
  const [coverLetterId, setCoverLetterId] = useState<string | null>(null);
  const [aiSummaryId, setAiSummaryId] = useState<string | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [selectedRound, setSelectedRound] = useState<string | null>(null);

  const { candidates, isLoading, hasMore, fetchNext } = useFinalVerdictsData(subTab);

  return (
    <div className="final-verdict">
      <div className="fv-sub-tabs">
        {FINAL_VERDICT_SUB_TABS.map((st) => (
          <button
            key={st.key}
            className={`fv-sub-tab${subTab === st.key ? " fv-sub-tab--active" : ""}`}
            onClick={() => { setSubTab(st.key); setOpenId(null); }}
            type="button"
          >
            <i className={st.icon} />
            {st.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : candidates.length === 0 ? (
        <div className="hr-tab-placeholder">No {subTab} candidates</div>
      ) : (
        <>
          <div className="fv-card-grid">
            {candidates.map((a) => (
              <ApplicantCard
                key={a.id}
                applicant={a}
                isOpen={openId === a.id}
                readOnly
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
              <button className="screen-btn" onClick={fetchNext} type="button">
                Load More
              </button>
            )}
          </div>

          <ApplicantTimelineSheet openId={timelineId} onClose={() => setTimelineId(null)} />

          {candidates.map((a) => (
            <CoverLetterModal
              key={`cl-${a.id}`}
              open={coverLetterId === a.id}
              applicantName={a.name}
              coverLetter={a.coverLetter ?? ""}
              onClose={() => setCoverLetterId(null)}
            />
          ))}

          {candidates.map((a) => (
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
            roundId={selectedRound}
            onClose={() => setSelectedRound(null)}
          />

          {candidates.map((a) => (
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
