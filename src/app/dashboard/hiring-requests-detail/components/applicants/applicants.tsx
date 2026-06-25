import { useState, useEffect } from "react";
import Select from "@/components/ui/select/select";
import ApplicantCard from "./applicant-card";
import ApplicantTimelineSheet from "@/app/dashboard/hiring-requests-detail/components/timeline/timeline";
import CoverLetterModal from "@/app/dashboard/hiring-requests-detail/components/modal/cover-letter-modal";
import AiSummaryModal from "@/app/dashboard/hiring-requests-detail/components/modal/ai-summary-modal";
import type { Applicant, ApplicantStatus, AccordionTab, ApplicantsProps } from "./applicants.types";

function Applicants({ data, openId, setOpenId, filter, onFilterChange }: ApplicantsProps) {
  // justification: local mutable copy of data for optimistic status updates
  const [localData, setLocalData] = useState<Applicant[]>([]);
  // Sync prop data into local state when fetching completes, so we have a snapshot to mutate optimistically
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setLocalData(data); }, [data]);
  // justification: tracks which applicant is currently in screening mode
  const [screeningId, setScreeningId] = useState<string | null>(null);
  // justification: controls which applicant's timeline sheet is shown
  const [timelineId, setTimelineId] = useState<string | null>(null);
  // justification: controls which applicant's cover letter modal is shown
  const [coverLetterId, setCoverLetterId] = useState<string | null>(null);
  // justification: controls which applicant's AI summary modal is shown
  const [aiSummaryId, setAiSummaryId] = useState<string | null>(null);
  // justification: tracks which tab (cover-letter or ai-summary) is active in the accordion
  const [accordionTab, setAccordionTab] = useState<AccordionTab>("cover-letter");

  const updateStatus = (id: string, status: ApplicantStatus) => {
    setLocalData((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  return (
    <>
      <div className="filter-bar">
        <Select
          placeholder="Filter"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          options={[
            { value: "shortlisted", label: "Shortlisted" },
            { value: "non-shortlisted", label: "Non-shortlisted" },
            { value: "all", label: "All Candidates" },
          ]}
        />
      </div>
      <div className="accordion-list">
      {localData.map((a) => {
        const isOpen = openId === a.id;
        const isScreening = screeningId === a.id;

        return (
          <ApplicantCard
            key={a.id}
            applicant={a}
            isOpen={isOpen}
            isScreening={isScreening}
            accordionTab={accordionTab}
            onToggleOpen={(id) => setOpenId(isOpen ? null : id)}
            onStartScreening={(id) => { setScreeningId(id); setOpenId(id); }}
            onReject={(id) => { updateStatus(id, "rejected"); setScreeningId(null); }}
            onAccept={(id) => { updateStatus(id, "reviewing"); setScreeningId(null); }}
            onTabChange={setAccordionTab}
            onCoverLetterReadMore={setCoverLetterId}
            onAiSummaryReadMore={setAiSummaryId}
            onTimeline={setTimelineId}
          />
        );
      })}

      <ApplicantTimelineSheet openId={timelineId} onClose={() => setTimelineId(null)} />

      {localData.map((a) => (
        <CoverLetterModal
          key={`cl-${a.id}`}
          open={coverLetterId === a.id}
          applicantName={a.name}
          coverLetter={a.coverLetter ?? ""}
          onClose={() => setCoverLetterId(null)}
        />
      ))}

      {localData.map((a) => (
        <AiSummaryModal
          key={`ai-${a.id}`}
          open={aiSummaryId === a.id}
          applicantName={a.name}
          aiSummary={a.aiSummary ?? ""}
          onClose={() => setAiSummaryId(null)}
        />
      ))}
    </div>
    </>
  );
}

export default Applicants;
