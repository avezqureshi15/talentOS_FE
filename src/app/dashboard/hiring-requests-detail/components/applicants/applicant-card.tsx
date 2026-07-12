import { useState, useRef, useEffect, useCallback } from "react";
import { formatDate } from "./applicants.utils";
import { APPLICANT_LABELS } from "@/constants/constants";
import { INFO_CHIPS } from "./applicants.constants";
import { useApplicantState } from "./hooks/use-applicant-state";
import CardExpandedContent from "./card-expanded-content";
import InfoChipTooltip from "@/components/ui/info-chip-tooltip/info-chip-tooltip";
import type { ApplicantCardProps } from "./applicants.types";

const ApplicantCard = ({
  applicant: a,
  isOpen,
  isScreening = false,
  readOnly = false,
  accordionTab,
  onToggleOpen,
  onAction,
  onMenuAction,
  onTabChange,
  onCoverLetterReadMore,
  onAiSummaryReadMore,
  onDetailsReadMore,
  onTimeline,
  onViewRound,
}: ApplicantCardProps) => {
  const stateConfig = useApplicantState(a, isScreening);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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

  const isFinal = stateConfig.state === "rejected" || stateConfig.state === "selected";
  const canExpand = readOnly || !isFinal;
  const showExpanded = isOpen && (stateConfig.showExpandedContent || readOnly);
  const showMenu = stateConfig.menuActions.length > 0 && a.finalVerdict == null && !readOnly;

  return (
    <div className="accordion-card">
      <div className="accordion-header">
        <div className="header-left" onClick={() => { if (canExpand) onToggleOpen(a.id); }}>
          <div className="name">
            {a.name}
            {stateConfig.chip && (
              <span className={`state-chip state-chip--${stateConfig.chip.variant}`}>
                {stateConfig.chip.label}
              </span>
            )}
          </div>
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
          {stateConfig.showInfoChips && (
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
          )}

          {stateConfig.showInfoChips && a.score != null && (
            <div
              className={`ats-score ${a.score >= 70 ? "score-high" : a.score >= 40 ? "score-mid" : "score-low"}`}
              onMouseEnter={(e) => showTooltip(e, ["ATS score is calculated based on how the resume matches job description"])}
              onMouseLeave={hideTooltip}
            >
              {a.score}
            </div>
          )}

          {a.rejectedStatus && a.rejectedStatus.length > 0 && (
            <div className="info-chip-row--rejection">
              {a.rejectedStatus.map((s, i) => (
                <span key={i} className="rejection-chip">{s}</span>
              ))}
            </div>
          )}

          {stateConfig.actions.length > 0 && <span className="header-action-divider" />}

          {stateConfig.actions.map((action) => (
            onAction && (
              <button
                key={action.handler}
                className={`btn ${action.variant === "shortlist" || action.variant === "schedule" ? "shortlist" : action.variant === "reject" ? "reject" : "screen-btn"} compact`}
                onClick={(e) => { e.stopPropagation(); onAction(action.handler, a.id); }}
              >
                {action.icon && <i className={action.icon} />} {action.label}
              </button>
            )
          ))}

          {showMenu && onMenuAction && (
            <>
              <span className="header-action-divider" />
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
                    {stateConfig.menuActions.includes("select") && (
                      <button className="menu-item menu-item-select" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onMenuAction("select", a.id); }} type="button">
                        {APPLICANT_LABELS.SELECT_CANDIDATE}
                      </button>
                    )}
                    {stateConfig.menuActions.includes("reject") && (
                      <button className="menu-item menu-item-reject" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onMenuAction("reject", a.id); }} type="button">
                        {APPLICANT_LABELS.REJECT_CANDIDATE}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {showExpanded && (
        <CardExpandedContent
          applicant={a}
          stateConfig={stateConfig}
          accordionTab={accordionTab}
          onTabChange={onTabChange}
          onTimeline={onTimeline}
          onDetailsReadMore={onDetailsReadMore}
          onCoverLetterReadMore={onCoverLetterReadMore}
          onAiSummaryReadMore={onAiSummaryReadMore}
          onViewRound={onViewRound}
        />
      )}
      {tooltip && <InfoChipTooltip lines={tooltip.lines} rect={tooltip.rect} />}
    </div>
  );
};

export default ApplicantCard;
