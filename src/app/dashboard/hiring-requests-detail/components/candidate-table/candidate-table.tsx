import type { ReactNode } from "react";
import DataTable from "@/components/ui/data-table/data-table";
import CandidateRowActions from "./candidate-row-actions/candidate-row-actions";
import { PersonAvatar } from "@/components/shared/person-avatar/person-avatar";
import { TruncatedCell } from "@/components/shared/truncated-cell/truncated-cell";
import "./candidate-table.css";
import type { CandidateTableProps } from "./candidate-table.types";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";
import { SCREENING_STATUS_LABELS } from "@/app/dashboard/hiring-requests-detail/components/detail/detail.constants";
import ScreeningActions from "./screening-actions/screening-actions";
import ScreeningStatusBadge from "./screening-actions/screening-status-badge";
import { formatPhoneDisplay } from "./screening-actions/screening-actions.utils";

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

const getScoreClass = (score?: number) => {
  if (score == null) return "";
  if (score >= 70) return "score-high";
  if (score >= 40) return "score-mid";
  return "score-low";
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  under_evaluation: "Completed",
  shortlisted: "Shortlisted",
  resume_shortlisted: "Shortlisted",
  rejected: "Rejected",
  scheduled: "Scheduled",
  move_to_next_round: "Move to Next",
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
  move_to_next_round: "Move to Next Round",
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

function getDisplayStatus(rawStatus: string): { label: string; cssClass: string; tooltip: string } {
  return {
    label: STATUS_LABELS[rawStatus] ?? toLabel(rawStatus),
    cssClass: rawStatus,
    tooltip: STATUS_TOOLTIPS[rawStatus] ?? STATUS_LABELS[rawStatus] ?? toLabel(rawStatus),
  };
}

const isInterviewStatus = (s: string) =>
  s === "interview_scheduled" || s === "interview_rescheduled" || s === "interview_cancelled" || s === "screening_round_scheduled" || s === "ongoing";

const CandidateTable = ({
  data, columns, onRowClick, onInfoClick, onAction, onMenuAction, onTimelineOpen,
  showBulkSelection,
  selectedIds,
  onToggleSelect, onToggleSelectAll, allSelected,
  activeStage, loading,
  hiringRequestId,
  onScreeningTriggered,
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
            {activeStage === "screening" && c.screeningReview?.attempt != null && (
              <span className="attempt-badge--inline">attempt {c.screeningReview.attempt}</span>
            )}
          </div>
          {c.score != null
            ? <span className={`ats-score ${getScoreClass(c.score)}`}>Score: {c.score}</span>
            : c.email && <TruncatedCell text={c.email} className="candidate-email" />
          }
        </div>
      </div>
    ),
    score: (c) =>
      c.score != null ? (
        <span className={`ats-score ${getScoreClass(c.score)}`}>{c.score}</span>
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
        onAction={onAction ?? (() => {})}
        onMenuAction={onMenuAction ?? (() => {})}
        onViewProfile={(cand) => onInfoClick?.(cand)}
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
          onAction={onAction ?? (() => {})}
          onMenuAction={onMenuAction ?? (() => {})}
          onViewProfile={(cand) => onInfoClick?.(cand)}
          hideCallNow={activeStage === "screening"}
        />
      </div>
    ),
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
      onRowClick={onRowClick}
      selection={
        showBulkSelection && selectedIds && onToggleSelect
          ? { selectedIds, onToggleSelect, onToggleSelectAll: onToggleSelectAll ?? (() => {}), allSelected: allSelected ?? false }
          : undefined
      }
      rowClassName={(c) =>
        isInterviewStatus(c.status) || activeStage === "waiting-evaluation" || !onRowClick ? "dt-row--disabled" : ""
      }
      animated
    />
  );
};

export default CandidateTable;
