import { useState, useEffect, useRef, useCallback } from "react";
import ApplicantCard from "./applicant-card";
import ApplicantFilters from "./applicant-filters";
import ApplicantActionModals from "./applicant-action-modals";
import ApplicantTimelineSheet from "@/app/dashboard/hiring-requests-detail/components/timeline/timeline";
import CoverLetterModal from "@/app/dashboard/hiring-requests-detail/components/modal/cover-letter-modal";
import AiSummaryModal from "@/app/dashboard/hiring-requests-detail/components/modal/ai-summary-modal";
import ApplicantDetailsModal from "@/app/dashboard/hiring-requests-detail/components/modal/applicant-details-modal";
import RoundsSidePanel from "@/app/dashboard/hiring-requests-detail/components/rounds-side-panel/rounds-side-panel";
import ScheduleRoundModal from "@/app/dashboard/hiring-requests-detail/components/schedule-round/schedule-round-modal";
import type { Applicant, ApplicantStatus, AccordionTab, ApplicantsProps } from "./applicants.types";

function Applicants({ data, openId, setOpenId, filter, onFilterChange, hasMore, onLoadMore, scoreFilter, onScoreFilterChange, applicantParam }: ApplicantsProps) {
  // justification: stores local status/screening overrides that can't persist to API yet
  const [localOverrides, setLocalOverrides] = useState<Record<string, { status?: ApplicantStatus; screening?: boolean }>>({});
  const [screeningId, setScreeningId] = useState<string | null>(null);
  const [timelineId, setTimelineId] = useState<string | null>(null);
  const [coverLetterId, setCoverLetterId] = useState<string | null>(null);
  const [aiSummaryId, setAiSummaryId] = useState<string | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [accordionTab, setAccordionTab] = useState<AccordionTab>("details");
  const [finalCandidateId, setFinalCandidateId] = useState<string | null>(null);
  const [finalDecision, setFinalDecision] = useState<"selected" | "rejected" | null>(null);
  const [selectedRound, setSelectedRound] = useState<string | null>(null);
  const [rejectConfirmId, setRejectConfirmId] = useState<string | null>(null);
  const [scheduleCandidateId, setScheduleCandidateId] = useState<string | null>(null);
  // justification: tracks which candidate's shortlist modal is open
  const [shortlistCandidateId, setShortlistCandidateId] = useState<string | null>(null);
  // justification: tracks which step (1 = remarks, 2 = choose outcome) of the shortlist modal
  const [shortlistStep, setShortlistStep] = useState<1 | 2>(1);
  // justification: stores the HR's remarks typed in step 1
  const [shortlistRemarks, setShortlistRemarks] = useState("");
  // justification: tracks which candidate's final selection warning modal is open
  const [finalConfirmId, setFinalConfirmId] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && onLoadMore) onLoadMore();
    },
    [hasMore, onLoadMore],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, { rootMargin: "200px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  const overrideStatus = (id: string, status: ApplicantStatus) => {
    setLocalOverrides((prev) => ({ ...prev, [id]: { ...prev[id], status } }));
  };

  const handleFinalDecision = (id: string, decision: "selected" | "rejected") => {
    setFinalCandidateId(id);
    setFinalDecision(decision);
  };

  const confirmFinalDecision = () => {
    if (!finalCandidateId || !finalDecision) return;
    overrideStatus(finalCandidateId, finalDecision === "selected" ? "hired" : "rejected");
    setFinalCandidateId(null);
    setFinalDecision(null);
  };

  const handleShortlistOk = () => setShortlistStep(2);

  const handleMoveToNextRound = () => {
    if (shortlistCandidateId) {
      setScreeningId(shortlistCandidateId);
      setOpenId(shortlistCandidateId);
    }
    setShortlistCandidateId(null);
  };

  const handleOpenFinalSelectionWarning = () => {
    setFinalConfirmId(shortlistCandidateId);
    setShortlistCandidateId(null);
  };

  const handleConfirmFinalHire = () => {
    if (finalConfirmId) {
      overrideStatus(finalConfirmId, "hired");
      setScreeningId(null);
    }
    setFinalConfirmId(null);
  };

  const confirmReject = () => {
    if (rejectConfirmId) {
      overrideStatus(rejectConfirmId, "rejected");
      setScreeningId(null);
    }
    setRejectConfirmId(null);
  };

  const closeFinalDecision = () => {
    setFinalCandidateId(null);
    setFinalDecision(null);
  };

  const closeShortlist = () => setShortlistCandidateId(null);

  const getLocalStatus = (a: Applicant): ApplicantStatus => localOverrides[a.id]?.status ?? a.status;

  return (
    <>
      <ApplicantFilters filter={filter} onFilterChange={onFilterChange} scoreFilter={scoreFilter ?? "all"} onScoreFilterChange={onScoreFilterChange} />
      <div className="accordion-list">
      {data.map((a) => {
        const isOpen = openId === a.id;
        const isScreening = screeningId === a.id;
        const merged = { ...a, status: getLocalStatus(a) };
        return (
          <div key={a.id} data-applicant-id={a.id} data-highlight={applicantParam === a.id ? "true" : undefined}>
            <ApplicantCard
              applicant={merged}
              isOpen={isOpen}
              isScreening={isScreening}
              accordionTab={accordionTab}
              onToggleOpen={(id) => {
                if (isOpen) { setOpenId(null); } else { setOpenId(id); setAccordionTab("details"); }
              }}
              onStartScreening={(id) => { setScreeningId(id); setOpenId(id); }}
              onHrShortlist={(id) => { setShortlistCandidateId(id); setShortlistStep(1); setShortlistRemarks(""); }}
              onHrReject={setRejectConfirmId}
              onScheduleRound1={setScheduleCandidateId}
              onTabChange={setAccordionTab}
              onCoverLetterReadMore={setCoverLetterId}
              onAiSummaryReadMore={setAiSummaryId}
              onDetailsReadMore={setDetailsId}
              onTimeline={setTimelineId}
              onFinalDecision={handleFinalDecision}
              onViewRound={setSelectedRound}
            />
          </div>
        );
      })}
      {hasMore && <div ref={sentinelRef} className="scroll-sentinel" />}

      <ApplicantActionModals
        data={data}
        finalCandidateId={finalCandidateId}
        finalDecision={finalDecision}
        onCloseFinalDecision={closeFinalDecision}
        confirmFinalDecision={confirmFinalDecision}
        rejectConfirmId={rejectConfirmId}
        onCloseReject={() => setRejectConfirmId(null)}
        onConfirmReject={confirmReject}
        shortlistCandidateId={shortlistCandidateId}
        shortlistStep={shortlistStep}
        shortlistRemarks={shortlistRemarks}
        onShortlistRemarksChange={setShortlistRemarks}
        onShortlistOk={handleShortlistOk}
        onMoveToNextRound={handleMoveToNextRound}
        onOpenFinalSelectionWarning={handleOpenFinalSelectionWarning}
        onCloseShortlist={closeShortlist}
        finalConfirmId={finalConfirmId}
        onConfirmHire={handleConfirmFinalHire}
        onCloseFinalConfirm={() => setFinalConfirmId(null)}
      />

      <ScheduleRoundModal open={!!scheduleCandidateId} candidateName={data.find((a) => a.id === scheduleCandidateId)?.name ?? ""} candidateId={scheduleCandidateId ?? ""} onClose={() => setScheduleCandidateId(null)} onScheduled={(id) => { overrideStatus(id, "shortlisted"); setScreeningId(null); }} />

      <ApplicantTimelineSheet openId={timelineId} onClose={() => setTimelineId(null)} />

      {data.map((a) => (<CoverLetterModal key={`cl-${a.id}`} open={coverLetterId === a.id} applicantName={a.name} coverLetter={a.coverLetter ?? ""} onClose={() => setCoverLetterId(null)} />))}
      {data.map((a) => (<AiSummaryModal key={`ai-${a.id}`} open={aiSummaryId === a.id} applicantName={a.name} aiSummary={a.aiSummary ?? ""} onClose={() => setAiSummaryId(null)} />))}

      <RoundsSidePanel open={!!selectedRound} roundId={selectedRound} onClose={() => setSelectedRound(null)} />

      {data.map((a) => (<ApplicantDetailsModal
          key={`det-${a.id}`}
          open={detailsId === a.id}
          applicantName={a.name}
          details={{ currentCtc: a.currentCtc, expectedCtc: a.expectedCtc, location: a.location, yearsOfExperience: a.yearsOfExperience, noticePeriod: a.noticePeriod, howDidYouHear: a.howDidYouHear, willingToRelocate: a.willingToRelocate === true ? "Yes" : a.willingToRelocate === false ? "No" : undefined }}
          onClose={() => setDetailsId(null)}
        />))}
    </div>
    </>
  );
}

export default Applicants;
