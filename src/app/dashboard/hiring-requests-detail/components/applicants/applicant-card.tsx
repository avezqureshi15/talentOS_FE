import { useState, useRef, useEffect, useCallback } from "react";
import { formatDate, formatSlot } from "./applicants.utils";
import Chip from "@/components/ui/chip/chip";
import type { ChipVariant } from "@/components/ui/chip/chip.types";
import { APPLICANT_LABELS } from "@/constants/constants";
import { usePermissions } from "@/hooks/use-permissions";
import { useApplicantState } from "./hooks/use-applicant-state";
import CardExpandedContent from "./card-expanded-content";
import InfoChipTooltip from "@/components/shared/info-chip-tooltip/info-chip-tooltip";
import ApplicantMenuButton from "./applicant-menu-button/applicant-menu-button";
import type { ApplicantCardProps } from "./applicants.types";
import { MENU_ACTION_PERMISSIONS } from "./applicants.constants";

const ApplicantCard = ({
  applicant: a,
  isOpen,
  isScreening = false,
  readOnly = false,
  isSelected = false,
  showCheckbox = false,
  accordionTab,
  onToggleOpen,
  onAction,
  onMenuAction,
  onToggleSelect,
  onTabChange,
  onCoverLetterReadMore,
  onAiSummaryReadMore,
  onDetailsReadMore,
  onTimeline,
  jdId,
  isRemote = false,
}: ApplicantCardProps) => {
  const stateConfig = useApplicantState(a, isScreening);
  const { can } = usePermissions();

  const [tooltip, setTooltip] = useState<{ lines: string[]; rect: DOMRect; className?: string } | null>(null);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = useCallback((e: React.MouseEvent<HTMLSpanElement>, lines: string[], className?: string) => {
    if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    setTooltip({ lines, rect: e.currentTarget.getBoundingClientRect(), className });
  }, []);

  const hideTooltip = useCallback(() => {
    tooltipTimerRef.current = setTimeout(() => setTooltip(null), 80);
  }, []);

  useEffect(() => {
    return () => { if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current); };
  }, []);

  const canExpand = readOnly || true;
  const showExpanded = isOpen && (stateConfig.showExpandedContent || readOnly);
  const visibleActions = stateConfig.actions.filter(
    (action) => !action.permission || can(action.permission),
  );
  const visibleMenuActions = stateConfig.menuActions.filter((menuAction) =>
    can(MENU_ACTION_PERMISSIONS[menuAction]),
  );
  const showMenu = visibleMenuActions.length > 0 && !readOnly;

  return (
    <div className="accordion-card">
      <div className="accordion-header">
        <div className="header-left" onClick={() => { if (canExpand) onToggleOpen(a.id); }}>
          {showCheckbox && (
            <i
              className={`bx ${isSelected ? "bx-checkbox-checked" : "bx-checkbox"} applicant-checkbox`}
              onClick={(e) => { e.stopPropagation(); onToggleSelect?.(a.id); }}
            />
          )}
          <span className="name">
            {a.name}
            {a.candidateType === "REFERRAL" && <span className="candidate-type-tag">Referral</span>}
          </span>
          {a.email && <span className="header-meta-item"><i className="bx bx-envelope"></i> {a.email}</span>}
          {a.currentRoundId && jdId && (
            <button
              className="current-round-btn"
              onClick={(e) => { e.stopPropagation(); window.open(`/hiring-requests/${jdId}/round-details/${a.currentRoundId}?candidateId=${a.id}`, "_blank"); }}
              title="View round details"
              type="button"
            >
              <i className="bx bx-info-circle" /> Current Round
            </button>
          )}
          {stateConfig.chip && (
            <Chip variant={stateConfig.chip.variant as ChipVariant} size="sm">
              {stateConfig.chip.label}
            </Chip>
          )}
          {a.stage === "AI_INTERVIEW" && a.scheduledAt && (
            <span className="ai-interview-slot-chip" title="Scheduled AI interview slot">
              <i className="bx bx-time"></i> {formatSlot(a.scheduledAt)}
            </span>
          )}
          {a.stage === "AI_INTERVIEW" && a.status?.toLowerCase() === "no_show" && (
            <span
              className="ai-interview-slot-chip no-show-reason-chip"
              title={a.aiInterviewReview?.flagReason ?? "No reason recorded"}
            >
              <i className="bx bx-user-x"></i> {a.aiInterviewReview?.flagReason || "No Show"}
            </span>
          )}
          {a.appliedAt && (
            <span className="applied-date">
              <i className="bx bx-calendar"></i> {APPLICANT_LABELS.APPLIED} {formatDate(a.appliedAt)}
            </span>
          )}
        </div>

        <div className="header-right">
          {stateConfig.showInfoChips && a.score != null && (
            <div
              className={`ats-score ${a.score >= 70 ? "score-high" : a.score >= 40 ? "score-mid" : "score-low"}`}
              onMouseEnter={(e) => showTooltip(e, ["ATS score is calculated based on how the resume matches job description"], "info-chip-tooltip--wide")}
              onMouseLeave={hideTooltip}
            >
              {a.score}
            </div>
          )}

          {visibleActions.length > 0 && <span className="header-action-divider" />}

          {visibleActions.map((action) => (
            onAction && (
              <button
                key={action.handler}
                className={`btn ${action.variant === "shortlist" || action.variant === "schedule" || action.variant === "reschedule" ? "shortlist" : action.variant === "reject" ? "reject" : action.variant === "cancel" ? "cancel" : "screen-btn"} compact`}
                onClick={(e) => { e.stopPropagation(); onAction(action.handler, a.id); }}
              >
                {action.icon && <i className={action.icon} />} {action.label}
              </button>
            )
          ))}

          {showMenu && onMenuAction && (
            <>
              <span className="header-action-divider" />
              <ApplicantMenuButton
                menuActions={visibleMenuActions}
                onMenuAction={onMenuAction}
                id={a.id}
                onBeforeOpen={() => { if (!isOpen) onToggleOpen(a.id); }}
              />
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
          jdId={jdId}
          isRemote={isRemote}
        />
      )}
      {tooltip && <InfoChipTooltip lines={tooltip.lines} rect={tooltip.rect} className={tooltip.className} />}
    </div>
  );
};

export default ApplicantCard;
