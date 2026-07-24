import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { formatDate } from "./applicants.utils";
import Chip from "@/components/ui/chip/chip";
import type { ChipVariant } from "@/components/ui/chip/chip.types";
import { APPLICANT_LABELS } from "@/constants/constants";
import { INFO_CHIP_SKIP_KEYS } from "./applicants.constants";
import { useApplicantState } from "./hooks/use-applicant-state";
import CardExpandedContent from "./card-expanded-content";
import AtsScoreBadge from "./ats-score-badge";
import LastRoundControl from "./last-round-control";
import InfoChipTooltip from "@/components/shared/info-chip-tooltip/info-chip-tooltip";
import { canShowReschedule } from "./applicant-status.helpers";
import type { ApplicantCardProps } from "./applicants.types";


const INFO_CHIP_LABELS: Record<string, string> = {
  CTC: "Budget",
  NOTICE_PERIOD: "Notice Period",
};

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
  onTimeline,
  onViewRound,
  onReschedule,
  isRemote = false,
}: ApplicantCardProps) => {
  const stateConfig = useApplicantState(a, isScreening);
  const showReschedule =
    canShowReschedule({ status: a.status, activeInterview: a.activeInterview }) &&
    !!onReschedule &&
    !readOnly;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [tooltip, setTooltip] = useState<{ lines: string[]; rect: DOMRect; className?: string } | null>(null);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = useCallback(
    (e: React.MouseEvent<HTMLElement>, lines: string[], className?: string) => {
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
      setTooltip({ lines, rect: e.currentTarget.getBoundingClientRect(), className });
    },
    [],
  );

  const hideTooltip = useCallback(() => {
    tooltipTimerRef.current = setTimeout(() => setTooltip(null), 80);
  }, []);

  useEffect(() => {
    return () => {
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    };
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

  const infoChips = useMemo(() => {
    if (!a.reviews) return [];

    const rejectionKeys = new Set<string>();
    if (Array.isArray(a.reviews.rejection_details)) {
      const REJECTION_TO_INFO: Record<string, string> = { BUDGET: "CTC" };
      for (const item of a.reviews.rejection_details) {
        const k = Object.keys(item as Record<string, unknown>)[0];
        rejectionKeys.add(REJECTION_TO_INFO[k] ?? k);
      }
    }

    return Object.entries(a.reviews).flatMap(([key, value]) => {
      if (INFO_CHIP_SKIP_KEYS.has(key)) return [];
      if (rejectionKeys.has(key)) return [];
      if (typeof value === "object" && value != null && "actual" in value && "expected" in value) {
        return [{ key, value: value as { actual: string | number; expected: string | number } }];
      }
      return [];
    });
  }, [a.reviews]);

  return (
    <div className="accordion-card">
      <div className="accordion-header">
        <div
          className="header-left"
          onClick={() => {
            if (canExpand) onToggleOpen(a.id);
          }}
        >
          <div className="name">{a.name}</div>
          <div className="meta">
            {a.email && (
              <span>
                <i className="bx bx-envelope" aria-hidden /> {a.email}
              </span>
            )}
            <Chip variant={stateConfig.chip.variant as ChipVariant} size="sm">
              {stateConfig.chip.label}
            </Chip>
            {onViewRound && (
              <LastRoundControl
                candidateId={a.candidateId}
                currentRoundId={a.currentRoundId}
                status={a.status}
                activeInterview={a.activeInterview}
                finalVerdict={a.finalVerdict}
                closedPipelineView={readOnly}
                onViewRound={onViewRound}
              />
            )}
            {a.appliedAt && (
              <span className="applied-date">
                <i className="bx bx-calendar" aria-hidden /> {APPLICANT_LABELS.APPLIED}{" "}
                {formatDate(a.appliedAt)}
              </span>
            )}
          </div>
        </div>

        <div className="header-right">
          {stateConfig.showInfoChips && infoChips.length > 0 && (
            <div className="info-chip-row">
              {infoChips.map((chip) => {
                const actual = chip.value.actual;
                const expected = chip.value.expected;
                const hasActual = actual != null && actual !== "" && actual !== "?";
                const hasExpected = expected != null && expected !== "" && expected !== "?";
                if (!hasActual && !hasExpected) return null;
                const label = INFO_CHIP_LABELS[chip.key] ?? chip.key;
                const tipLines: string[] = [
                  label,
                  `Actual : ${hasActual ? actual : "—"}`,
                  `Expected : ${hasExpected ? expected : "—"}`,
                ];
                return (
                  <span
                    key={chip.key}
                    className="info-chip info-chip--red"
                    onMouseEnter={(e) => showTooltip(e, tipLines)}
                    onMouseLeave={hideTooltip}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          )}

          {a.reviews &&
            Array.isArray(a.reviews.rejection_details) &&
            (a.reviews.rejection_details as unknown[]).length > 0 && (
              <div className="info-chip-row--rejection">
                {(a.reviews.rejection_details as Array<Record<string, { JD: string; Candidate: string }>>).map(
                  (item, i) => {
                    const key = Object.keys(item)[0];
                    return (
                      <span key={i} className="rejection-chip">
                        {key}
                      </span>
                    );
                  },
                )}
              </div>
            )}

          <div className="header-right__actions">
            {showReschedule && (
              <button
                type="button"
                className="btn shortlist compact"
                onClick={(e) => {
                  e.stopPropagation();
                  onReschedule?.(a);
                }}
              >
                <i className="bx bx-calendar" aria-hidden /> Reschedule
              </button>
            )}
            {stateConfig.actions.map(
              (action) =>
                onAction && (
                  <button
                    key={action.handler}
                    type="button"
                    className={`btn ${action.variant === "shortlist" || action.variant === "schedule" ? "shortlist" : action.variant === "reject" ? "reject" : "screen-btn"} compact`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction(action.handler, a.id);
                    }}
                  >
                    {action.icon && <i className={action.icon} aria-hidden />} {action.label}
                  </button>
                ),
            )}
          </div>

          {stateConfig.showAtsScore && (
            <AtsScoreBadge score={a.score} onShowTooltip={showTooltip} onHideTooltip={hideTooltip} />
          )}

          {showMenu && onMenuAction && (
            <div className="three-dots-wrapper" ref={menuRef}>
              <button
                className="three-dots-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isOpen) onToggleOpen(a.id);
                  setMenuOpen((v) => !v);
                }}
                type="button"
                aria-label="More actions"
              >
                <i className="bx bx-dots-vertical-rounded" aria-hidden />
              </button>
              {menuOpen && (
                <div className="three-dots-menu">
                  {stateConfig.menuActions.includes("select") && (
                    <button
                      className="menu-item menu-item-select"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        onMenuAction("select", a.id);
                      }}
                      type="button"
                    >
                      {APPLICANT_LABELS.SELECT_CANDIDATE}
                    </button>
                  )}
                  {stateConfig.menuActions.includes("reject") && (
                    <button
                      className="menu-item menu-item-reject"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        onMenuAction("reject", a.id);
                      }}
                      type="button"
                    >
                      {APPLICANT_LABELS.REJECT_CANDIDATE}
                    </button>
                  )}
                </div>
              )}
            </div>
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
          onViewRound={onViewRound}
          isRemote={isRemote}
        />
      )}
      {tooltip && <InfoChipTooltip lines={tooltip.lines} rect={tooltip.rect} className={tooltip.className} />}
    </div>
  );
};

export default ApplicantCard;
