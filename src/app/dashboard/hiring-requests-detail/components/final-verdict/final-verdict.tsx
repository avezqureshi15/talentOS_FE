import { useState } from "react";
import ApplicantCard from "@/app/dashboard/hiring-requests-detail/components/applicants/applicant-card";
import Button from "@/components/ui/button/button";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ApplicantTimelineSheet from "@/app/dashboard/hiring-requests-detail/components/timeline/timeline";
import RoundsSidePanel from "@/app/dashboard/hiring-requests-detail/components/rounds-side-panel/rounds-side-panel";
import { FINAL_VERDICT_SUB_TABS } from "./final-verdict.constants";
import { useFinalVerdictsData } from "./hooks/use-final-verdicts-data";
import type { FinalVerdictProps, FinalVerdictSubTab } from "./final-verdict.types";
import type { AccordionTab } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";
import "./final-verdict.css";

const FinalVerdict = ({ jobId }: FinalVerdictProps) => {
  const [subTab, setSubTab] = useState<FinalVerdictSubTab>("selected");
  const [openId, setOpenId] = useState<string | null>(null);
  const [accordionTab, setAccordionTab] = useState<AccordionTab>("details");
  const [timelineId, setTimelineId] = useState<number | null>(null);
  const [selectedRound, setSelectedRound] = useState<string | null>(null);

  const { candidates, isLoading, isLoadingMore, hasMore, fetchNext } = useFinalVerdictsData(subTab, jobId);

  return (
    <div className="final-verdict">
      <div className="fv-sub-tabs">
        {FINAL_VERDICT_SUB_TABS.map((st) => (
          <button
            key={st.key}
            className={`fv-sub-tab${subTab === st.key ? " fv-sub-tab--active" : ""}`}
            onClick={() => {
              setSubTab(st.key);
              setOpenId(null);
            }}
            type="button"
          >
            <i className={st.icon} aria-hidden />
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
                  if (openId === id) {
                    setOpenId(null);
                  } else {
                    setOpenId(id);
                    setAccordionTab("details");
                  }
                }}
                onTabChange={setAccordionTab}
                onTimeline={setTimelineId}
                onViewRound={setSelectedRound}
              />
            ))}
            {hasMore && (
              <Button className="screen-btn" onClick={fetchNext} loading={isLoadingMore}>
                Load More
              </Button>
            )}
          </div>

          <ApplicantTimelineSheet openId={timelineId} onClose={() => setTimelineId(null)} />

          <RoundsSidePanel
            open={!!selectedRound}
            roundId={selectedRound}
            onClose={() => setSelectedRound(null)}
          />
        </>
      )}
    </div>
  );
};

export default FinalVerdict;
