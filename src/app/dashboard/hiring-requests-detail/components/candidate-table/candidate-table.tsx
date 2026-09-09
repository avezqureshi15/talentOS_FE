import type { ReactNode } from "react";
import DataTable from "@/components/ui/data-table/data-table";
import CandidateRowActions from "./candidate-row-actions/candidate-row-actions";
import { PersonAvatar } from "@/components/shared/person-avatar/person-avatar";
import { TruncatedCell } from "@/components/shared/truncated-cell/truncated-cell";
import "./candidate-table.css";
import type { CandidateTableProps } from "./candidate-table.types";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";
import { SCREENING_STATUS_LABELS, UI_EVALUATED_AI, UI_EVALUATED_REGULAR } from "@/app/dashboard/hiring-requests-detail/components/detail/detail.constants";
import ScreeningActions from "./screening-actions/screening-actions";
import ScreeningStatusBadge from "./screening-actions/screening-status-badge";
import { formatPhoneDisplay } from "./screening-actions/screening-actions.utils";
import { STATE_CONFIGS } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.constants";
import { canShowAtsScore } from "./ats-score";
import { AtsScoreChip } from "./ats-score-chip";
import CandidateExpandedPanel from "./candidate-expanded-panel";

const formatDate = (iso?: string): string => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return ""; }
};

const formatTime = (iso?: string): string => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  } catch { return ""; }
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  under_evaluation: "Completed",
  shortlisted: "Shortlisted",
  resume_shortlisted: "Shortlisted",
  rejected: "Rejected",
  scheduled: "Scheduled",
  move_to_next_round: "Ready to schedule",
  waiting_for_review: "Waiting",
  selected: "Selected",
  screening_round_scheduled: "Scheduled",
  ai_screening_evaluation_failed: "AI Screening Failed",
  ai_screening_flagged: "AI Screening Flagged",
  interview_scheduled: "Scheduled",
  interview_rescheduled: "Rescheduled",
  interview_cancelled: "Cancelled",
  ongoing: "Ongoing",
};

const STATUS_TOOLTIPS: Record<string, string> = {
  resume_shortlisted: "Resume Shortlisted",
  rejected: "Moved Out Of Pipeline",
  move_to_next_round: "Ready to schedule",
  selected: "Selected And Closed",
  screening_round_scheduled: "Screening Round Scheduled",
  ai_screening_evaluation_failed: "AI Screening Failed — retry or reject from the screening pipeline",
  ai_screening_flagged: "AI Screening Flagged — candidate needs manual review",
  interview_scheduled: "Interview Scheduled",
  interview_rescheduled: "Interview Rescheduled",
  interview_cancelled: "Interview Cancelled",
  ongoing: "Interview Ongoing",
};

function toLabel(raw: string): string {
  return raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const FINAL_VERDICT_TABLE_LABELS: Record<"selected" | "rejected" | "on-hold", string> = {
  selected: "Selected",
  rejected: "Rejected",
  "on-hold": "On Hold",
};

function getFinalVerdictChip(verdict?: string): { label: string; cssClass: string; tooltip: string } | null {
  if (verdict !== "selected" && verdict !== "rejected" && verdict !== "on-hold") return null;
  return {
    label: FINAL_VERDICT_TABLE_LABELS[verdict],
    cssClass: verdict,
    tooltip: STATE_CONFIGS[verdict].chip.label,
  };
}

function getDisplayStatus(rawStatus: string): { label: string; cssClass: string; tooltip: string } {
  const status = rawStatus?.toLowerCase() ?? "";
  return {
    label: STATUS_LABELS[status] ?? toLabel(status),
    cssClass: status,
    tooltip: STATUS_TOOLTIPS[status] ?? STATUS_LABELS[status] ?? toLabel(status),
  };
}

const CandidateTable = ({
  data, columns, onRowClick, onAction, onMenuAction, onTimelineOpen,
  showBulkSelection,
  selectedIds,
  onToggleSelect, onToggleSelectAll, allSelected,
  activeStage, loading,
  hiringRequestId,
  onScreeningTriggered,
  expandedId,
  isRemote,
}: CandidateTableProps) => {
  const CELL_RENDERERS: Record<string, (c: Applicant) => ReactNode> = {
    name: (c) => (
      <div className="applicant-table-cell--name">
        <PersonAvatar
          className="candidate-avatar"
          person={{ name: c.name, email: c.email, phone: c.phone }}
        />
        <div>
          <div className="candidate-name-line">
            <TruncatedCell text={c.name} className="candidate-name" />
            {c.candidateType === "REFERRAL" && <span className="candidate-type-tag">Referral</span>}
            {activeStage === "evaluation" && (
              <span className="candidate-type-tag">
                {c.stage === "AI_INTERVIEW" ? UI_EVALUATED_AI : UI_EVALUATED_REGULAR}
              </span>
            )}
            {activeStage === "screening" && c.screeningReview?.attempt != null && (
              <span className="attempt-badge--inline">attempt {c.screeningReview.attempt}</span>
            )}
          </div>
          {canShowAtsScore(activeStage, c.score) ? (
            <AtsScoreChip score={c.score} labeled />
          ) : (
            c.email && <TruncatedCell text={c.email} className="candidate-email" />
          )}
        </div>
      </div>
    ),
    score: (c) =>
      canShowAtsScore(activeStage, c.score) ? (
        <AtsScoreChip score={c.score} />
      ) : (
        <span className="text-muted">—</span>
      ),
    phone: (c) =>
      c.phone ? (
        <a href={`tel:${c.phone}`} className="candidate-phone" onClick={(e) => e.stopPropagation()}>
          <i className="bx bx-phone" />
          <TruncatedCell text={formatPhoneDisplay(c.phone)} />
        </a>
      ) : (
        <span className="text-muted">—</span>
      ),
    status: (c) => {
      const verdictChip = getFinalVerdictChip(c.finalVerdict);
      if (verdictChip) {
        return (
          <span className={`status-chip status-chip--${verdictChip.cssClass}`} title={verdictChip.tooltip}>
            {verdictChip.label}
          </span>
        );
      }
      if (activeStage === "resume-shortlisting" && c.score != null) {
        const selected = c.score >= 70;
        return (
          <span className={`status-chip status-chip--${selected ? "selected" : "rejected"}`} title={selected ? "Selected" : "Rejected"}>
            {selected ? "Selected" : "Rejected"}
          </span>
        );
      }
      if (activeStage === "screening") {
        const hasReview =
          c.screeningReview || c.status?.toLowerCase() === "ai_screening_flagged" || c.status?.toLowerCase() === "ai_screening_evaluation_failed";
        if (hasReview) {
          return <ScreeningStatusBadge candidate={c} />;
        }
        const legacyScreeningLabel = SCREENING_STATUS_LABELS[c.status?.toLowerCase() ?? ""];
        if (legacyScreeningLabel) {
          return (
            <span className={`status-chip status-chip--${legacyScreeningLabel.toLowerCase()}`} title={legacyScreeningLabel}>
              {legacyScreeningLabel}
            </span>
          );
        }
      }
      const ds = getDisplayStatus(c.status);
      return (
        <span className={`status-chip status-chip--${ds.cssClass}`} title={ds.tooltip}>{ds.label}</span>
      );
    },
    cv: (c) =>
      c.cvUrl ? (
        <a href={c.cvUrl} target="_blank" rel="noopener noreferrer" className="cv-link" onClick={(e) => e.stopPropagation()}>
          <i className="bx bx-arrow-in-up-right-circle" />
        </a>
      ) : (
        <span className="text-muted">—</span>
      ),
    timeline: (c) => (
      <button className="timeline-btn" onClick={(e) => { e.stopPropagation(); onTimelineOpen?.(c); }} type="button">
        <i className="bx bx-timeline" />
      </button>
    ),
    info: (c) => (
        <CandidateRowActions
          candidate={c}
          isScreening={activeStage === "screening"}
          onAction={onAction ?? (() => {})}
          onMenuAction={onMenuAction ?? (() => {})}
          onTimeline={onTimelineOpen}
        />
    ),
    startDate: (c) =>
      c.scheduledAt ? (
        <span className="interview-date">{formatDate(c.scheduledAt)}</span>
      ) : (
        <span className="text-muted">—</span>
      ),
    endDate: (c) =>
      c.scheduledEndAt ? (
        <span className="interview-date">{formatDate(c.scheduledEndAt)}</span>
      ) : (
        <span className="text-muted">—</span>
      ),
    time: (c) =>
      c.scheduledAt ? (
        <span className="interview-time">{formatTime(c.scheduledAt)}</span>
      ) : (
        <span className="text-muted">—</span>
      ),
    actions: (c) => (
      <div className="screening-actions-cell">
        <ScreeningActions
          candidate={c}
          hiringRequestId={hiringRequestId ?? ""}
          onScreeningTriggered={onScreeningTriggered}
        />
        <CandidateRowActions
          candidate={c}
          isScreening={activeStage === "screening"}
          onAction={onAction ?? (() => {})}
          onMenuAction={onMenuAction ?? (() => {})}
          onTimeline={onTimelineOpen}
          hideCallNow={activeStage === "screening"}
        />
      </div>
    ),
  };

  const handleRowClick = (c: Applicant) => {
    onRowClick?.(c);
  };

  const gridTemplate = columns.map((col) => `${col.flex}fr`).join(" ");

  return (
    <DataTable
      columns={columns.map((col) => ({
        header: col.label,
        className:
          col.key === "timeline" || col.key === "cv"
            ? "dt-cell-center"
            : col.key === "actions" || col.key === "info"
              ? "dt-cell-right"
              : undefined,
        headerClassName:
          col.key === "actions" || col.key === "info"
            ? "dt-cell-center"
            : undefined,
        render: (c: Applicant) => {
          const render = CELL_RENDERERS[col.key];
          return render ? render(c) : null;
        },
      }))}
      data={data}
      loading={loading}
      keyExtractor={(c) => c.id}
      emptyMessage="No candidates match the current filters."
      gridTemplateColumns={gridTemplate}
      onRowClick={onRowClick ? handleRowClick : undefined}
      expandedKey={expandedId}
      renderExpanded={(c) => (
        <CandidateExpandedPanel
          applicant={c}
          jdId={hiringRequestId}
          isRemote={isRemote}
          isScreening={activeStage === "screening"}
          onTimeline={(id) => {
            onTimelineOpen?.({ ...c, candidateId: id });
          }}
        />
      )}
      selection={
        showBulkSelection && selectedIds && onToggleSelect
          ? { selectedIds, onToggleSelect, onToggleSelectAll: onToggleSelectAll ?? (() => {}), allSelected: allSelected ?? false }
          : undefined
      }
      animated
    />
  );
};

export default CandidateTable;
