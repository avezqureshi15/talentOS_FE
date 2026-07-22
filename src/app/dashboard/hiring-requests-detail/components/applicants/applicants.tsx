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
import { updateReviewByRound, updateFinalVerdict } from "@/services/reviews/reviews";
import { fetchMockApplicants } from "@/services/mock/mock-applicants";
import { useApplicantActions } from "./hooks/use-applicant-actions";
import type { Applicant, ApplicantStatus, AccordionTab, ApplicantsProps } from "./applicants.types";

type LocalOverride = {
  status?: ApplicantStatus;
  screening?: boolean;
  finalVerdict?: string;
};

function Applicants({ data: propData, openId, setOpenId, filter, onFilterChange, hasMore, onLoadMore, scoreFilter, onScoreFilterChange, rejectReason, onRejectReasonChange, applicantParam, onRefresh, jdId, isRemote }: ApplicantsProps) {
  const [localOverrides, setLocalOverrides] = useState<Record<string, LocalOverride>>({});
  const [screeningId, setScreeningId] = useState<string | null>(null);
  const [timelineId, setTimelineId] = useState<number | null>(null);
  const [coverLetterId, setCoverLetterId] = useState<string | null>(null);
  const [aiSummaryId, setAiSummaryId] = useState<string | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [accordionTab, setAccordionTab] = useState<AccordionTab>("details");
  const [finalCandidateId, setFinalCandidateId] = useState<string | null>(null);
  const [finalDecision, setFinalDecision] = useState<"selected" | "rejected" | null>(null);
  const [selectedRound, setSelectedRound] = useState<string | null>(null);
  const [rejectConfirmId, setRejectConfirmId] = useState<string | null>(null);
  const [rejectRemarks, setRejectRemarks] = useState("");
  const [rejectStep, setRejectStep] = useState<1 | 2>(1);
  const [scheduleCandidateId, setScheduleCandidateId] = useState<string | null>(null);
  const [shortlistCandidateId, setShortlistCandidateId] = useState<string | null>(null);
  const [shortlistStep, setShortlistStep] = useState<1 | 2>(1);
  const [shortlistRemarks, setShortlistRemarks] = useState("");
  const [finalConfirmId, setFinalConfirmId] = useState<string | null>(null);
  const [mockData, setMockData] = useState<Applicant[] | null>(null);
  const [isConfirmingFinalDecision, setIsConfirmingFinalDecision] = useState(false);
  const [isConfirmingReject, setIsConfirmingReject] = useState(false);
  const [isShortlisting, setIsShortlisting] = useState(false);
  const [isConfirmingHire, setIsConfirmingHire] = useState(false);

  useEffect(() => {
    if (!propData) {
      fetchMockApplicants().then(setMockData);
    }
  }, [propData]);

  const data = propData ?? mockData ?? [];

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

  const overrideFinalVerdict = (id: string, verdict: string) => {
    setLocalOverrides((prev) => ({ ...prev, [id]: { ...prev[id], finalVerdict: verdict } }));
  };

  const confirmFinalDecision = async () => {
    if (!finalCandidateId || !finalDecision) return;
    setIsConfirmingFinalDecision(true);
    try {
      const applicant = data.find((a) => a.id === finalCandidateId);
      if (applicant) {
        try {
          const verdict = finalDecision === "selected" ? "SELECTED" as const : "REJECTED" as const;
          await updateFinalVerdict(applicant.candidateId, verdict);
          overrideFinalVerdict(finalCandidateId, finalDecision);
        } catch {
          overrideFinalVerdict(finalCandidateId, finalDecision);
        }
      } else {
        overrideFinalVerdict(finalCandidateId, finalDecision);
      }
      setFinalCandidateId(null);
      setFinalDecision(null);
      onRefresh?.();
    } finally {
      setIsConfirmingFinalDecision(false);
    }
  };

  const handleShortlistOk = async () => {
    setIsShortlisting(true);
    try {
      const applicant = data.find((a) => a.id === shortlistCandidateId);
      if (!applicant?.currentRoundId) { setShortlistStep(2); setIsShortlisting(false); return; }
      try {
        await updateReviewByRound(applicant.currentRoundId, {
          entity_type: "hr",
          reviews: { remarks: shortlistRemarks },
          verdict: "shortlisted",
        });
      } catch {
        // API failure shouldn't block the UI flow
      }
      if (shortlistCandidateId) {
        overrideStatus(shortlistCandidateId, "shortlisted");
      }
      setShortlistStep(2);
    } finally {
      setIsShortlisting(false);
    }
  };

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

  const handleConfirmFinalHire = async () => {
    setIsConfirmingHire(true);
    try {
      if (finalConfirmId) {
        const applicant = data.find((a) => a.id === finalConfirmId);
        if (applicant) {
          try {
            await updateFinalVerdict(applicant.candidateId, "SELECTED");
            overrideFinalVerdict(finalConfirmId, "selected");
          } catch {
            overrideFinalVerdict(finalConfirmId, "selected");
          }
        } else {
          overrideFinalVerdict(finalConfirmId, "selected");
        }
        setScreeningId(null);
      }
      setFinalConfirmId(null);
      onRefresh?.();
    } finally {
      setIsConfirmingHire(false);
    }
  };

  const confirmRejectFromEvaluation = async (id: string) => {
    setRejectConfirmId(id);
    setRejectStep(1);
    setRejectRemarks("");
  };

  const confirmReject = async () => {
    setIsConfirmingReject(true);
    try {
      const applicant = data.find((a) => a.id === rejectConfirmId);
      if (applicant?.currentRoundId) {
        try {
          await updateReviewByRound(applicant.currentRoundId, {
            entity_type: "hr",
            reviews: { remarks: rejectRemarks },
            verdict: "rejected",
          });
        } catch {
          // API failure shouldn't block the UI flow
        }
      }
      if (rejectConfirmId) {
        overrideStatus(rejectConfirmId, "rejected");
        overrideFinalVerdict(rejectConfirmId, "rejected");
        setScreeningId(null);
      }
      setRejectConfirmId(null);
      setRejectRemarks("");
      setRejectStep(1);
      onRefresh?.();
    } finally {
      setIsConfirmingReject(false);
    }
  };

  const closeFinalDecision = () => {
    setFinalCandidateId(null);
    setFinalDecision(null);
  };

  const closeShortlist = () => setShortlistCandidateId(null);

  const getLocalApplicant = (a: Applicant): Applicant => ({
    ...a,
    status: localOverrides[a.id]?.status ?? a.status,
    finalVerdict: localOverrides[a.id]?.finalVerdict ?? a.finalVerdict,
  });

  const {
    handleAction,
    handleMenuAction,
  } = useApplicantActions({
    onShortlist: (id) => { setShortlistCandidateId(id); setShortlistStep(1); setShortlistRemarks(""); },
    onRejectFromEvaluation: confirmRejectFromEvaluation,
    onMoveToNextRound: (id) => { setShortlistCandidateId(id); setShortlistStep(1); setShortlistRemarks(""); },
    onScheduleInterview: (id) => { setScheduleCandidateId(id); },
    onMenuSelect: (id) => { setFinalCandidateId(id); setFinalDecision("selected"); },
    onMenuReject: (id) => { setFinalCandidateId(id); setFinalDecision("rejected"); },
  });

  return (
    <>
      <ApplicantFilters filter={filter} onFilterChange={onFilterChange} scoreFilter={scoreFilter ?? "all"} onScoreFilterChange={onScoreFilterChange} rejectReason={rejectReason} onRejectReasonChange={onRejectReasonChange} />
      <div className="accordion-list">
      {data.map((a) => {
        const isOpen = openId === a.id;
        const isScreening = screeningId === a.id;
        const merged = getLocalApplicant(a);
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
              onAction={handleAction}
              onMenuAction={handleMenuAction}
              onTabChange={setAccordionTab}
              onCoverLetterReadMore={setCoverLetterId}
              onAiSummaryReadMore={setAiSummaryId}
              onDetailsReadMore={setDetailsId}
              onTimeline={setTimelineId}
              onViewRound={setSelectedRound}
              isRemote={isRemote}
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
        rejectRemarks={rejectRemarks}
        rejectStep={rejectStep}
        onRejectRemarksChange={setRejectRemarks}
        onRejectNextStep={() => setRejectStep(2)}
        onCloseReject={() => { setRejectConfirmId(null); setRejectRemarks(""); setRejectStep(1); }}
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
        isConfirmingFinalDecision={isConfirmingFinalDecision}
        isConfirmingReject={isConfirmingReject}
        isShortlisting={isShortlisting}
        isConfirmingHire={isConfirmingHire}
      />

      <ScheduleRoundModal open={!!scheduleCandidateId} candidateName={data.find((a) => a.id === scheduleCandidateId)?.name ?? ""} candidateId={scheduleCandidateId ?? ""} candidateNumberId={data.find((a) => a.id === scheduleCandidateId)?.candidateId ?? 0} jdId={jdId} onClose={() => setScheduleCandidateId(null)} onScheduled={(id) => { overrideStatus(id, "scheduled"); setScreeningId(null); onRefresh?.(); }} />

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
          isRemote={isRemote}
        />))}
    </div>
    </>
  );
}

export default Applicants;
