import { motion } from "framer-motion";
import type { ReactNode } from "react";
import "./candidate-table.css";
import type { CandidateTableProps } from "./candidate-table.types";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

const getInitials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

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

const SkeletonRows = ({ count, columns, showBulkSelection }: { count: number; columns: CandidateTableProps["columns"]; showBulkSelection?: boolean }) => {
  const checkboxFlex = "40px";
  const gridTemplate = showBulkSelection
    ? `${checkboxFlex} ${columns.map((col) => `${col.flex}fr`).join(" ")}`
    : columns.map((col) => `${col.flex}fr`).join(" ");
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="applicant-table-row applicant-table-row--skeleton" style={{ gridTemplateColumns: gridTemplate }}>
          {showBulkSelection && <div className="applicant-table-cell"><span className="skeleton-pulse skeleton-box" /></div>}
          {columns.map((col) => (
            <div key={col.key} className="applicant-table-cell">
              <span className={`skeleton-pulse ${col.key === "name" ? "skeleton-name" : "skeleton-text"}`} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

const CandidateTable = ({
  data, columns, onRowClick, onInfoClick, onTimelineOpen,
  showBulkSelection,
  selectedIds,
  onToggleSelect, onToggleSelectAll, allSelected,
  activeStage, loading,
}: CandidateTableProps) => {
  const CELL_RENDERERS: Record<string, (c: Applicant, onInfo?: (c: Applicant) => void) => ReactNode> = {
    name: (c) => (
      <div className="applicant-table-cell applicant-table-cell--name">
        <div className="candidate-avatar">{getInitials(c.name)}</div>
        <div>
          <div className="candidate-name">{c.name}</div>
          {c.email && <div className="candidate-email">{c.email}</div>}
        </div>
      </div>
    ),
    score: (c) => (
      <div className="applicant-table-cell">
        {c.score != null ? (
          <span className={`ats-score ${getScoreClass(c.score)}`}>{c.score}</span>
        ) : (
          <span className="text-muted">—</span>
        )}
      </div>
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
        <div className="applicant-table-cell">
          <span className={`status-chip status-chip--${cssClass}`} title={tooltip}>{label}</span>
        </div>
      );
    },
    cv: (c) => (
      <div className="applicant-table-cell">
        {c.cvUrl ? (
          <a href={c.cvUrl} target="_blank" rel="noopener noreferrer" className="cv-link" onClick={(e) => e.stopPropagation()}>
            <i className="bx bx-arrow-in-up-right-circle" />
          </a>
        ) : (
          <span className="text-muted">—</span>
        )}
      </div>
    ),
    timeline: (c) => (
      <div className="applicant-table-cell">
        <button className="timeline-btn" onClick={(e) => { e.stopPropagation(); onTimelineOpen?.(c); }} type="button">
          <i className="bx bx-timeline" />
        </button>
      </div>
    ),
    info: (c, onInfo) => (
      <div className="applicant-table-cell applicant-table-cell--info">
        <button
          className="info-icon-btn"
          onClick={(e) => { e.stopPropagation(); onInfo?.(c); }}
          type="button"
          title="View Profile"
        >
          <i className="bx bx-user" />
          <span>View</span>
        </button>
      </div>
    ),
    startDate: (c) => (
      <div className="applicant-table-cell">
        {c.scheduledAt ? (
          <span className="interview-date">{formatDate(c.scheduledAt)}</span>
        ) : (
          <span className="text-muted">—</span>
        )}
      </div>
    ),
    endDate: (c) => (
      <div className="applicant-table-cell">
        {c.scheduledEndAt ? (
          <span className="interview-date">{formatDate(c.scheduledEndAt)}</span>
        ) : (
          <span className="text-muted">—</span>
        )}
      </div>
    ),
    time: (c) => (
      <div className="applicant-table-cell">
        {c.scheduledAt ? (
          <span className="interview-time">{formatTime(c.scheduledAt)}</span>
        ) : (
          <span className="text-muted">—</span>
        )}
      </div>
    ),
  };
  const checkboxFlex = "40px";
  const gridTemplate = showBulkSelection
    ? `${checkboxFlex} ${columns.map((col) => `${col.flex}fr`).join(" ")}`
    : columns.map((col) => `${col.flex}fr`).join(" ");

  return (
    <div className="candidate-table-wrapper">
      <div className="applicant-table">
        <div className="applicant-table-header" style={{ gridTemplateColumns: gridTemplate }}>
          {showBulkSelection && (
            <span className="applicant-table-cell applicant-table-cell--checkbox">
              <i
                className={`bx ${allSelected ? "bx-checkbox-checked" : "bx-checkbox"} applicant-checkbox`}
                onClick={onToggleSelectAll}
              />
            </span>
          )}
          {columns.map((col) => (
            <span key={col.key} className="applicant-table-cell">{col.label}</span>
          ))}
        </div>

        {loading ? (
          <SkeletonRows count={5} columns={columns} showBulkSelection={showBulkSelection} />
        ) : data.length === 0 ? (
          <div className="applicant-table-empty">No candidates match the current filters.</div>
        ) : (
          data.map((candidate, idx) => (
            <motion.div
              key={candidate.id}
              className={`applicant-table-row${isInterviewStatus(candidate.status) || activeStage === "waiting-evaluation" || !onRowClick ? " applicant-table-row--disabled" : ""}`}
              style={{ gridTemplateColumns: gridTemplate }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.2 }}
              onClick={() => onRowClick?.(candidate)}
            >
              {showBulkSelection && (
                <div className="applicant-table-cell applicant-table-cell--checkbox">
                  <i
                    className={`bx ${selectedIds?.has(candidate.id) ? "bx-checkbox-checked" : "bx-checkbox"} applicant-checkbox`}
                    onClick={(e) => { e.stopPropagation(); onToggleSelect?.(candidate.id); }}
                  />
                </div>
              )}
              {columns.map((col) => {
                const render = CELL_RENDERERS[col.key];
                return render ? render(candidate, onInfoClick) : <div key={col.key} className="applicant-table-cell" />;
              })}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default CandidateTable;