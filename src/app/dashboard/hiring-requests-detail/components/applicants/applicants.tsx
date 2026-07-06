import { useState, useEffect, useRef, useCallback } from "react";
import Select from "@/components/ui/select/select";
import BaseModal from "@/components/ui/modal/base-modal";
import ApplicantCard from "./applicant-card";
import ApplicantTimelineSheet from "@/app/dashboard/hiring-requests-detail/components/timeline/timeline";
import CoverLetterModal from "@/app/dashboard/hiring-requests-detail/components/modal/cover-letter-modal";
import AiSummaryModal from "@/app/dashboard/hiring-requests-detail/components/modal/ai-summary-modal";
import ApplicantDetailsModal from "@/app/dashboard/hiring-requests-detail/components/modal/applicant-details-modal";
import RoundsSidePanel from "@/app/dashboard/hiring-requests-detail/components/rounds-side-panel/rounds-side-panel";
import ScheduleRoundModal from "@/app/dashboard/hiring-requests-detail/components/schedule-round/schedule-round-modal";
import { APPLICANT_LABELS, MOCK_ROUNDS } from "@/constants/constants";
import { SCORE_FILTERS, STATUS_FILTER_OPTIONS, STATUS_FILTER_LABELS, REJECT_FILTER_OPTIONS, REJECT_FILTER_LABELS } from "./applicants.constants";
import type { Applicant, ApplicantStatus, AccordionTab, ApplicantsProps } from "./applicants.types";

function Applicants({ data, openId, setOpenId, filter, onFilterChange, hasMore, onLoadMore, scoreFilter, onScoreFilterChange, applicantParam }: ApplicantsProps) {
  // justification: stores local status/screening overrides that can't persist to API yet
  const [localOverrides, setLocalOverrides] = useState<Record<string, { status?: ApplicantStatus; screening?: boolean }>>({});
  // justification: local UI state for rejected-by filter dropdown
  const [rejectFilter, setRejectFilter] = useState("all");
  const [screeningId, setScreeningId] = useState<string | null>(null);
  const [timelineId, setTimelineId] = useState<string | null>(null);
  const [coverLetterId, setCoverLetterId] = useState<string | null>(null);
  const [aiSummaryId, setAiSummaryId] = useState<string | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [accordionTab, setAccordionTab] = useState<AccordionTab>("details");
  const [finalCandidateId, setFinalCandidateId] = useState<string | null>(null);
  const [finalDecision, setFinalDecision] = useState<"selected" | "rejected" | null>(null);
  const [roundId, setRoundId] = useState<string | null>(null);
  const [rejectConfirmId, setRejectConfirmId] = useState<string | null>(null);
  const [scheduleCandidateId, setScheduleCandidateId] = useState<string | null>(null);
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
          options={STATUS_FILTER_OPTIONS}
        />
        <span className="filter-separator" />
        <Select
          placeholder="All Scores"
          value={scoreFilter === "all" ? "" : scoreFilter}
          onChange={(e) => onScoreFilterChange?.(e.target.value || "all")}
          options={SCORE_FILTERS.filter((o) => o.value !== "all").map((o) => ({ value: o.value, label: o.label }))}
        />
        <span className="filter-separator" />
        <Select
          placeholder="Rejected"
          value={rejectFilter === "all" ? "" : rejectFilter}
          onChange={(e) => setRejectFilter(e.target.value || "all")}
          options={REJECT_FILTER_OPTIONS}
        />
      </div>
      <div className="filter-chips">
        {filter !== "all" && (
          <span className="filter-chip">
            {STATUS_FILTER_LABELS[filter]}
            <i className="bx bx-x filter-chip-x" onClick={() => onFilterChange("all")} />
          </span>
        )}
        {scoreFilter !== "all" && (
          <span className="filter-chip">
            Score: {SCORE_FILTERS.find((o) => o.value === scoreFilter)?.label ?? scoreFilter}
            <i className="bx bx-x filter-chip-x" onClick={() => onScoreFilterChange?.("all")} />
          </span>
        )}
        {rejectFilter !== "all" && (
          <span className="filter-chip">
            Rejected: {REJECT_FILTER_LABELS[rejectFilter]}
            <i className="bx bx-x filter-chip-x" onClick={() => setRejectFilter("all")} />
          </span>
        )}
      </div>
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
              onToggleOpen={(id) => setOpenId(isOpen ? null : id)}
              onStartScreening={(id) => { setScreeningId(id); setOpenId(id); }}
              onHrShortlist={(id) => { overrideStatus(id, "reviewing"); }}
              onHrReject={setRejectConfirmId}
              onScheduleRound1={setScheduleCandidateId}
              onTabChange={setAccordionTab}
              onCoverLetterReadMore={setCoverLetterId}
              onAiSummaryReadMore={setAiSummaryId}
              onDetailsReadMore={setDetailsId}
              onTimeline={setTimelineId}
              onFinalDecision={handleFinalDecision}
              onViewRound={setRoundId}
            />
          </div>
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

      <BaseModal
        open={!!rejectConfirmId}
        onClose={() => setRejectConfirmId(null)}
        title={APPLICANT_LABELS.HR_REJECT}
      >
        <div className="confirm-body">
          <p>{APPLICANT_LABELS.REJECT_WARNING}</p>
          <div className="confirm-actions">
            <button className="confirm-btn confirm-cancel" onClick={() => setRejectConfirmId(null)} type="button">Cancel</button>
            <button
              className="confirm-btn confirm-danger"
              onClick={() => {
                if (rejectConfirmId) {
                  overrideStatus(rejectConfirmId, "rejected");
                  setScreeningId(null);
                }
                setRejectConfirmId(null);
              }}
              type="button"
            >
              Reject
            </button>
          </div>
        </div>
      </BaseModal>

      <ScheduleRoundModal
        open={!!scheduleCandidateId}
        candidateName={data.find((a) => a.id === scheduleCandidateId)?.name ?? ""}
        candidateId={scheduleCandidateId ?? ""}
        onClose={() => setScheduleCandidateId(null)}
        onScheduled={(id) => { overrideStatus(id, "shortlisted"); setScreeningId(null); }}
      />

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
