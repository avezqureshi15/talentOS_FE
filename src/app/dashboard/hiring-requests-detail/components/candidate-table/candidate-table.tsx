import type { ReactNode } from "react";
import DataTable from "@/components/ui/data-table/data-table";
import CandidateActionsMenu from "./candidate-actions-menu/candidate-actions-menu";
import { PersonAvatar } from "@/components/shared/person-avatar/person-avatar";
import "./candidate-table.css";
import type { CandidateTableProps } from "./candidate-table.types";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

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
  s === "interview_scheduled" || s === "interview_rescheduled" || s === "interview_cancelled" || s === "screening_round_scheduled";

const CandidateTable = ({
  data, columns, onRowClick, onInfoClick, onScheduleClick, onTimelineOpen,
  showBulkSelection,
  selectedIds,
  onToggleSelect, onToggleSelectAll, allSelected,
  activeStage, loading,
}: CandidateTableProps) => {
  const CELL_RENDERERS: Record<string, (c: Applicant, onInfo?: (c: Applicant) => void) => ReactNode> = {
    name: (c) => (
      <div className="applicant-table-cell--name">
        <PersonAvatar
          className="candidate-avatar"
          person={{ name: c.name, email: c.email, phone: c.phone }}
        />
        <div>
          <div className="candidate-name">
            {c.name}
            {c.candidateType === "REFERRAL" && <span className="candidate-type-tag">Referral</span>}
          </div>
          {c.email && <div className="candidate-email">{c.email}</div>}
        </div>
      </div>
    ),
    score: (c) =>
      c.score != null ? (
        <span className={`ats-score ${getScoreClass(c.score)}`}>{c.score}</span>
      ) : (
        <span className="text-muted">—</span>
      ),
    status: (c) => {
      let label: string;
      let cssClass: string;
      let tooltip: string;
      if (activeStage === "resume-shortlisting" && c.score != null) {
        label = c.score >= 70 ? "Selected" : "Rejected";
        cssClass = c.score >= 70 ? "selected" : "rejected";
        tooltip = label;
      } else {
        const ds = getDisplayStatus(c.status);
        label = ds.label;
        cssClass = ds.cssClass;
        tooltip = ds.tooltip;
      }
      return (
        <span className={`status-chip status-chip--${cssClass}`} title={tooltip}>{label}</span>
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
    info: (c, onInfo) => (
      <CandidateActionsMenu
        candidate={c}
        onViewProfile={(cand) => onInfo?.(cand)}
        onScheduleRound={onScheduleClick}
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
    attempt: (c) =>
      c.screeningReview?.attempt != null ? (
        <span className="attempt-badge">#{c.screeningReview.attempt}</span>
      ) : (
        <span className="text-muted">—</span>
      ),
  };

  const gridTemplate = columns.map((col) => `${col.flex}fr`).join(" ");

  return (
    <DataTable
      columns={columns.map((col) => ({
        header: col.label,
        className: col.key === "info" || col.key === "timeline" || col.key === "cv" ? "dt-cell-center" : undefined,
        render: (c: Applicant) => {
          const render = CELL_RENDERERS[col.key];
          return render ? render(c, onInfoClick) : null;
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
