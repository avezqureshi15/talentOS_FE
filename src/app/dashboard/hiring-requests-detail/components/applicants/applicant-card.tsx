import { useState, useRef, useEffect, useCallback } from "react";
import { formatDate } from "./applicants.utils";
import { APPLICANT_LABELS } from "@/constants/constants";
import { INFO_CHIPS } from "./applicants.constants";
import type { ApplicantCardProps } from "./applicants.types";
import CardDetailsTab from "./card-details-tab";
import CardCoverLetterTab from "./card-cover-letter-tab";
import CardAiSummaryTab from "./card-ai-summary-tab";
import CardRoundsTab from "./card-rounds-tab";
import InfoChipTooltip from "@/components/ui/info-chip-tooltip/info-chip-tooltip";

const ApplicantCard = ({
  applicant: a,
  isOpen,
  isScreening,
  accordionTab,
  onToggleOpen,
  onStartScreening,
  onHrShortlist,
  onHrReject,
  onTabChange,
  onCoverLetterReadMore,
  onAiSummaryReadMore,
  onDetailsReadMore,
  onTimeline,
  onScheduleRound1,
  onFinalDecision,
  onViewRound,
}: ApplicantCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // justification: tracks hovered chip position and lines for portal tooltip
  const [tooltip, setTooltip] = useState<{ lines: string[]; rect: DOMRect } | null>(null);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = useCallback((e: React.MouseEvent<HTMLSpanElement>, lines: string[]) => {
    if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    setTooltip({ lines, rect: e.currentTarget.getBoundingClientRect() });
  }, []);

  const hideTooltip = useCallback(() => {
    tooltipTimerRef.current = setTimeout(() => setTooltip(null), 80);
  }, []);

  useEffect(() => {
    return () => { if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current); };
  }, []);

  // justification: outside click listener for three-dots menu
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <div className="accordion-card">
      <div className="accordion-header">
        <div className="header-left" onClick={() => onToggleOpen(a.id)}>
          <div className="name">{a.name}</div>
          <div className="meta">
            {a.email && <span><i className="bx bx-envelope"></i> {a.email}</span>}
            {a.appliedAt && (
              <span className="applied-date">
                <i className="bx bx-calendar"></i> {APPLICANT_LABELS.APPLIED} {formatDate(a.appliedAt)}
              </span>
            )}
          </div>
        </div>

        <div className="header-right">
          <div className="info-chip-row">
            {INFO_CHIPS.map((chip) => {
              const hasActual = a[chip.actualKey] != null && a[chip.actualKey] !== "";
              const hasExpected = a[chip.expectedKey] != null && a[chip.expectedKey] !== "";
              if (!hasActual && !hasExpected) return null;
              const tipLines: string[] = [chip.title];
              const actual = a[chip.actualKey];
              tipLines.push(`Actual : ${actual != null && actual !== "" ? actual : "—"}${chip.actualSuffix ?? ""}`);
              const expected = a[chip.expectedKey];
              tipLines.push(`Expected : ${expected != null && expected !== "" ? expected : "—"}${chip.expectedSuffix ?? ""}`);
              return (
                <span
                  key={chip.label}
                  className="info-chip info-chip--red"
                  onMouseEnter={(e) => showTooltip(e, tipLines)}
                  onMouseLeave={hideTooltip}
                >
                  {chip.label}
                </span>
              );
            })}
          </div>

          {a.score != null && (
            <div
              className={`ats-score ${a.score >= 70 ? "score-high" : a.score >= 40 ? "score-mid" : "score-low"}`}
              onMouseEnter={(e) => showTooltip(e, ["ATS score is calculated based on how the resume matches job description"])}
              onMouseLeave={hideTooltip}
            >
              {a.score}
            </div>
          )}

          <span className="header-action-divider" />

          {a.status === "new" && !isScreening && (
            <>
              <button className="btn shortlist compact" onClick={(e) => { e.stopPropagation(); onHrShortlist(a.id); }}>
                <i className="bx bx-check" /> {APPLICANT_LABELS.HR_SHORTLIST}
              </button>
              <button className="btn reject compact" onClick={(e) => { e.stopPropagation(); onHrReject(a.id); }}>
                <i className="bx bx-x" /> {APPLICANT_LABELS.HR_REJECT}
              </button>
            </>
          )}

          {a.status === "new" && isScreening && (
            <button className="btn shortlist compact" onClick={(e) => { e.stopPropagation(); onScheduleRound1(a.id); }}>
              <i className="bx bx-check" /> {APPLICANT_LABELS.SCHEDULE_NEXT_ROUND}
            </button>
          )}

          {a.status === "reviewing" && !isScreening && (
            <button className="screen-btn compact" onClick={(e) => { e.stopPropagation(); onStartScreening(a.id); }}>
              {APPLICANT_LABELS.START_SCREENING}
            </button>
          )}

          {a.status === "reviewing" && isScreening && (
            <>
              <button className="btn shortlist compact" onClick={(e) => { e.stopPropagation(); onScheduleRound1(a.id); }}>
                <i className="bx bx-check" /> {APPLICANT_LABELS.SCHEDULE_ROUND_1}
              </button>
              <button className="btn reject compact" onClick={(e) => { e.stopPropagation(); onHrReject(a.id); }}>
                <i className="bx bx-x" /> {APPLICANT_LABELS.HR_REJECT}
              </button>
            </>
          )}

          <div className="three-dots-wrapper" ref={menuRef}>
            <button
              className="three-dots-btn"
              onClick={(e) => { e.stopPropagation(); if (!isOpen) onToggleOpen(a.id); setMenuOpen((v) => !v); }}
              type="button"
            >
              <i className="bx bx-dots-vertical-rounded"></i>
            </button>
            {menuOpen && (
              <div className="three-dots-menu">
                <button className="menu-item menu-item-select" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onFinalDecision(a.id, "selected"); }} type="button">
                  {APPLICANT_LABELS.SELECT_CANDIDATE}
                </button>
                <button className="menu-item menu-item-reject" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onFinalDecision(a.id, "rejected"); }} type="button">
                  {APPLICANT_LABELS.REJECT_CANDIDATE}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="accordion-body">
          <div className="action-links">
            {a.phone && <a href={`tel:${a.phone}`} className="action-link"><i className="bx bx-phone"></i> {a.phone}</a>}
            <a href={a.linkedinUrl} target="_blank" rel="noreferrer" className="action-link"><i className="bx bx-link-alt"></i> {APPLICANT_LABELS.LINKEDIN}</a>
            <a href={a.cvUrl} target="_blank" rel="noreferrer" className="action-link"><i className="bx bx-file"></i> {APPLICANT_LABELS.CV}</a>
            <button className="action-link action-link-btn" onClick={(e) => { e.stopPropagation(); onTimeline(a.id); }}>
              <i className="bx bx-clock"></i> {APPLICANT_LABELS.TIMELINE}
            </button>
          </div>

          <div className="accordion-tabs block">
            <button className={`accordion-tab ${accordionTab === "details" ? "accordion-tab--active" : ""}`} onClick={() => onTabChange("details")} type="button">
              <i className="bx bx-detail" /> {APPLICANT_LABELS.DETAILS}
            </button>
            <button className={`accordion-tab ${accordionTab === "cover-letter" ? "accordion-tab--active" : ""}`} onClick={() => onTabChange("cover-letter")} type="button">
              <i className="bx bx-notepad" /> {APPLICANT_LABELS.COVER_LETTER}
            </button>
            <button className={`accordion-tab ${accordionTab === "ai-summary" ? "accordion-tab--active" : ""}`} onClick={() => onTabChange("ai-summary")} type="button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" /></svg>
              {APPLICANT_LABELS.AI_SUMMARY}
            </button>
            <button className={`accordion-tab ${accordionTab === "rounds" ? "accordion-tab--active" : ""}`} onClick={() => onTabChange("rounds")} type="button">
              <i className="bx bx-repeat" /> {APPLICANT_LABELS.ROUNDS}
            </button>
          </div>

          {accordionTab === "details" && <CardDetailsTab applicant={a} onDetailsReadMore={onDetailsReadMore} />}
          {accordionTab === "cover-letter" && <CardCoverLetterTab coverLetter={a.coverLetter ?? ""} applicantId={a.id} onReadMore={onCoverLetterReadMore} />}
          {accordionTab === "rounds" && <CardRoundsTab rounds={a.rounds} onViewRound={onViewRound} />}
          {accordionTab === "ai-summary" && <CardAiSummaryTab aiSummary={a.aiSummary ?? ""} applicantId={a.id} onReadMore={onAiSummaryReadMore} />}

          {a.status === "rejected" && <div className="rejected-text">{APPLICANT_LABELS.CANDIDATE_REJECTED}</div>}
          {a.status === "hired" && <div className="hired-text">{APPLICANT_LABELS.CANDIDATE_HIRED}</div>}
        </div>
      )}
      {tooltip && <InfoChipTooltip lines={tooltip.lines} rect={tooltip.rect} />}
    </div>
  );
};

export default ApplicantCard;
