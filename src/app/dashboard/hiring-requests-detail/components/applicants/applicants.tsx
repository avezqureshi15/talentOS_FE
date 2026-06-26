import { useState, useEffect, useRef, useCallback } from "react";
import Select from "@/components/ui/select/select";
import BaseModal from "@/components/ui/modal/base-modal";
import ApplicantCard from "./applicant-card";
import ApplicantTimelineSheet from "@/app/dashboard/hiring-requests-detail/components/timeline/timeline";
import CoverLetterModal from "@/app/dashboard/hiring-requests-detail/components/modal/cover-letter-modal";
import AiSummaryModal from "@/app/dashboard/hiring-requests-detail/components/modal/ai-summary-modal";
import ApplicantDetailsModal from "@/app/dashboard/hiring-requests-detail/components/modal/applicant-details-modal";
import RoundsSidePanel from "@/app/dashboard/hiring-requests-detail/components/rounds-side-panel/rounds-side-panel";
import { APPLICANT_LABELS, MOCK_ROUNDS } from "@/constants/constants";
import type { Applicant, ApplicantStatus, AccordionTab, ApplicantsProps, InterviewRound } from "./applicants.types";

const SCORE_FILTERS = [
  { value: "all", label: "All Scores" },
  { value: "gte80", label: "≥ 80" },
  { value: "gte70", label: "≥ 70" },
  { value: "gte50", label: "≥ 50" },
  { value: "lt50", label: "< 50" },
  { value: "lt30", label: "< 30" },
];

function Applicants({ data, openId, setOpenId, filter, onFilterChange, hasMore, onLoadMore, scoreFilter, onScoreFilterChange }: ApplicantsProps) {
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
  const [roundId, setRoundId] = useState<string | null>(null);
  const selectedRound = roundId ? MOCK_ROUNDS.find((r) => r.id === roundId) ?? null : null;

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && onLoadMore) {
        onLoadMore();
      }
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

  const getLocalStatus = (a: Applicant): ApplicantStatus => localOverrides[a.id]?.status ?? a.status;

  const actionLabel = finalDecision === "selected"
    ? APPLICANT_LABELS.SELECT_CANDIDATE
    : APPLICANT_LABELS.REJECT_CANDIDATE;

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
        <span className="filter-separator" />
        {SCORE_FILTERS.map((opt) => (
          <button
            key={opt.value}
            className={`score-filter-chip ${scoreFilter === opt.value ? "active" : ""}`}
            onClick={() => onScoreFilterChange?.(opt.value)}
            type="button"
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="accordion-list">
      {data.map((a) => {
        const isOpen = openId === a.id;
        const isScreening = screeningId === a.id;
        const merged = { ...a, status: getLocalStatus(a) };

        return (
          <ApplicantCard
            key={a.id}
            applicant={merged}
            isOpen={isOpen}
            isScreening={isScreening}
            accordionTab={accordionTab}
            onToggleOpen={(id) => setOpenId(isOpen ? null : id)}
            onStartScreening={(id) => { setScreeningId(id); setOpenId(id); }}
            onReject={(id) => { overrideStatus(id, "rejected"); setScreeningId(null); }}
            onAccept={(id) => { overrideStatus(id, "reviewing"); setScreeningId(null); }}
            onTabChange={setAccordionTab}
            onCoverLetterReadMore={setCoverLetterId}
            onAiSummaryReadMore={setAiSummaryId}
            onDetailsReadMore={setDetailsId}
            onTimeline={setTimelineId}
            onFinalDecision={handleFinalDecision}
            onViewRound={setRoundId}
          />
        );
      })}

      {hasMore && <div ref={sentinelRef} className="scroll-sentinel" />}

      <BaseModal
        open={!!finalCandidateId}
        onClose={() => { setFinalCandidateId(null); setFinalDecision(null); }}
        title={actionLabel}
      >
        <div className="confirm-body">
          <p>
            {APPLICANT_LABELS.FINAL_DECISION_CONFIRM.replace("{action}", finalDecision === "selected" ? "select" : "reject")}
          </p>
          <div className="confirm-actions">
            <button
              className="confirm-btn confirm-cancel"
              onClick={() => { setFinalCandidateId(null); setFinalDecision(null); }}
              type="button"
            >
              Cancel
            </button>
            <button
              className={`confirm-btn ${finalDecision === "selected" ? "confirm-proceed" : "confirm-danger"}`}
              onClick={confirmFinalDecision}
              type="button"
            >
              {finalDecision === "selected" ? "Select" : "Reject"}
            </button>
          </div>
        </div>
      </BaseModal>

      <ApplicantTimelineSheet openId={timelineId} onClose={() => setTimelineId(null)} />

      {data.map((a) => (
        <CoverLetterModal
          key={`cl-${a.id}`}
          open={coverLetterId === a.id}
          applicantName={a.name}
          coverLetter={a.coverLetter ?? ""}
          onClose={() => setCoverLetterId(null)}
        />
      ))}

      {data.map((a) => (
        <AiSummaryModal
          key={`ai-${a.id}`}
          open={aiSummaryId === a.id}
          applicantName={a.name}
          aiSummary={a.aiSummary ?? ""}
          onClose={() => setAiSummaryId(null)}
        />
      ))}

      <RoundsSidePanel
        open={!!roundId}
        round={selectedRound}
        onClose={() => setRoundId(null)}
      />

      {data.map((a) => (
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
          }}
          onClose={() => setDetailsId(null)}
        />
      ))}
    </div>
    </>
  );
}

export default Applicants;
