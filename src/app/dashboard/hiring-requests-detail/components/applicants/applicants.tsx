import { useState, useEffect, useRef, useCallback } from "react";
import ApplicantCard from "./applicant-card";
import ApplicantFilters from "./applicant-filters";
import ApplicantActionModals from "./applicant-action-modals";
import ApplicantTimelineSheet from "@/app/dashboard/hiring-requests-detail/components/timeline/timeline";
import RoundsSidePanel from "@/app/dashboard/hiring-requests-detail/components/rounds-side-panel/rounds-side-panel";
import ScheduleRoundModal from "@/app/dashboard/hiring-requests-detail/components/schedule-round/schedule-round-modal";
import { updateReviewByRound, updateFinalVerdict } from "@/services/reviews/reviews";
import { fetchMockApplicants } from "@/services/mock/mock-applicants";
import { useApplicantActions } from "./hooks/use-applicant-actions";
import { resolveDisplayStatus } from "./applicant-status.helpers";
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
  const [accordionTab, setAccordionTab] = useState<AccordionTab>("details");
  const [finalCandidateId, setFinalCandidateId] = useState<string | null>(null);
  const [finalDecision, setFinalDecision] = useState<"selected" | "rejected" | null>(null);
  const [selectedRound, setSelectedRound] = useState<string | null>(null);
  const [rejectConfirmId, setRejectConfirmId] = useState<string | null>(null);
  const [rejectRemarks, setRejectRemarks] = useState("");
  const [rejectStep, setRejectStep] = useState<1 | 2>(1);
  const [scheduleCandidateId, setScheduleCandidateId] = useState<string | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<Applicant | null>(null);
  const [shortlistCandidateId, setShortlistCandidateId] = useState<string | null>(null);
  const [shortlistRemarks, setShortlistRemarks] = useState("");
  const [shortlistAction, setShortlistAction] = useState<"move" | "final" | null>(null);
  const [finalConfirmId, setFinalConfirmId] = useState<string | null>(null);
  const [mockData, setMockData] = useState<Applicant[] | null>(null);
  // UI state for async action loading indicators
  const [isConfirmingFinalDecision, setIsConfirmingFinalDecision] = useState(false);
  const [isConfirmingReject, setIsConfirmingReject] = useState(false);
  const [isShortlisting, setIsShortlisting] = useState(false);
  const [isConfirmingHire, setIsConfirmingHire] = useState(false);

  // justification: fallback to mock API when no prop data is provided
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

  const submitHrShortlist = async (applicantId: string): Promise<boolean> => {
    const applicant = data.find((a) => a.id === applicantId);
    if (!applicant?.currentRoundId) return false;
    try {
      await updateReviewByRound(applicant.currentRoundId, {
        entity_type: "hr",
        reviews: { remarks: shortlistRemarks },
        verdict: "shortlisted",
      });
    } catch {
      // API failure shouldn't block the UI flow
    }
    return true;
  };

  const handleShortlistMove = async () => {
    if (!shortlistCandidateId) return;
    setIsShortlisting(true);
    setShortlistAction("move");
    try {
      await submitHrShortlist(shortlistCandidateId);
      overrideStatus(shortlistCandidateId, "move_to_next_round");
      setOpenId(shortlistCandidateId);
      setShortlistCandidateId(null);
      setShortlistRemarks("");
      onRefresh?.();
    } finally {
      setIsShortlisting(false);
      setShortlistAction(null);
    }
  };

  const handleShortlistFinal = async () => {
    if (!shortlistCandidateId) return;
    setIsShortlisting(true);
    setShortlistAction("final");
    try {
      await submitHrShortlist(shortlistCandidateId);
      const id = shortlistCandidateId;
      setFinalConfirmId(id);
      setShortlistCandidateId(null);
      setShortlistRemarks("");
    } finally {
      setIsShortlisting(false);
      setShortlistAction(null);
    }
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

  const closeShortlist = () => {
    if (isShortlisting) return;
    setShortlistCandidateId(null);
    setShortlistRemarks("");
    setShortlistAction(null);
  };

  const getLocalApplicant = (a: Applicant): Applicant => ({
    ...a,
    status: resolveDisplayStatus(a.status, localOverrides[a.id]?.status) ?? a.status,
    finalVerdict: localOverrides[a.id]?.finalVerdict ?? a.finalVerdict,
  });

  const {
    handleAction,
    handleMenuAction,
  } = useApplicantActions({
    onShortlist: (id) => { setShortlistCandidateId(id); setShortlistRemarks(""); setShortlistAction(null); },
    onRejectFromEvaluation: confirmRejectFromEvaluation,
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
              onTimeline={setTimelineId}
              onViewRound={setSelectedRound}
              onReschedule={setRescheduleTarget}
              isRemote={isRemote}
            />
          </div>
        );
      })}
      {hasMore && <div ref={sentinelRef} className="scroll-sentinel" />}

      <ApplicantActionModals
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
        shortlistRemarks={shortlistRemarks}
        onShortlistRemarksChange={setShortlistRemarks}
        onShortlistMove={handleShortlistMove}
        onShortlistFinal={handleShortlistFinal}
        onCloseShortlist={closeShortlist}
        finalConfirmId={finalConfirmId}
        onConfirmHire={handleConfirmFinalHire}
        onCloseFinalConfirm={() => setFinalConfirmId(null)}
        isConfirmingFinalDecision={isConfirmingFinalDecision}
        isConfirmingReject={isConfirmingReject}
        isShortlisting={isShortlisting}
        shortlistAction={shortlistAction}
        isConfirmingHire={isConfirmingHire}
      />

      <ScheduleRoundModal open={!!scheduleCandidateId} candidateName={data.find((a) => a.id === scheduleCandidateId)?.name ?? ""} candidateId={scheduleCandidateId ?? ""} candidateNumberId={data.find((a) => a.id === scheduleCandidateId)?.candidateId ?? 0} jdId={jdId} onClose={() => setScheduleCandidateId(null)} onScheduled={(id) => { overrideStatus(id, "scheduled"); setScreeningId(null); onRefresh?.(); }} />

      {rescheduleTarget?.activeInterview && (
        <ScheduleRoundModal
          open
          rescheduleMode
          interviewId={rescheduleTarget.activeInterview.id}
          interviewerEmpId={
            rescheduleTarget.activeInterview.interviewerUserId != null
              ? String(rescheduleTarget.activeInterview.interviewerUserId)
              : undefined
          }
          interviewerName={rescheduleTarget.activeInterview.interviewerName ?? undefined}
          roundName={rescheduleTarget.activeInterview.roundName ?? undefined}
          candidateName={rescheduleTarget.name}
          candidateId={rescheduleTarget.id}
          candidateNumberId={rescheduleTarget.candidateId}
          jdId={jdId}
          onClose={() => setRescheduleTarget(null)}
          onScheduled={() => {
            overrideStatus(rescheduleTarget.id, "interview_rescheduled");
            setRescheduleTarget(null);
            onRefresh?.();
          }}
        />
      )}

      <ApplicantTimelineSheet openId={timelineId} onClose={() => setTimelineId(null)} />

      <RoundsSidePanel open={!!selectedRound} roundId={selectedRound} onClose={() => setSelectedRound(null)} />
    </div>
    </>
  );
}

export default Applicants;
