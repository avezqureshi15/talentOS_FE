import { motion } from "framer-motion";
import type { ReactNode } from "react";
import "./candidate-table.css";
import type { CandidateTableProps } from "./candidate-table.types";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

const getInitials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const getScoreClass = (score?: number) => {
  if (score == null) return "";
  if (score >= 70) return "score-high";
  if (score >= 40) return "score-mid";
  return "score-low";
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  under_evaluation: "Evaluating",
  shortlisted: "Shortlisted",
  resume_shortlisted: "Resume Shortlisted",
  rejected: "Rejected",
  scheduled: "Scheduled",
  move_to_next_round: "Move to Next",
  waiting_for_review: "Waiting",
  selected: "Selected",
};

function getDisplayStatus(score: number | undefined, rawStatus: string): { label: string; cssClass: string } {
  if (score != null) {
    return score >= 70
      ? { label: "Shortlisted", cssClass: "shortlisted" }
      : { label: "Rejected", cssClass: "rejected" };
  }
  return { label: STATUS_LABELS[rawStatus] ?? rawStatus, cssClass: rawStatus };
}

const isInterviewStatus = (s: string) =>
  s === "interview_scheduled" || s === "interview_rescheduled" || s === "interview_cancelled";

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
    const ds = getDisplayStatus(c.score, c.status);
    return (
      <div className="applicant-table-cell">
        <span className={`status-chip status-chip--${ds.cssClass}`}>{ds.label}</span>
      </div>
    );
  },
  info: (c, onInfo) => (
    <div className="applicant-table-cell applicant-table-cell--info">
      <button
        className="info-icon-btn"
        onClick={(e) => { e.stopPropagation(); onInfo?.(c); }}
        title="Candidate Info"
        type="button"
      >
        <i className="bx bx-info-circle" />
      </button>
    </div>
  ),
};

const CandidateTable = ({ data, columns, onRowClick, onInfoClick }: CandidateTableProps) => {
  const gridTemplate = columns.map((col) => `${col.flex}fr`).join(" ");

  return (
    <div className="candidate-table-wrapper">
      <div className="applicant-table">
        <div className="applicant-table-header" style={{ gridTemplateColumns: gridTemplate }}>
          {columns.map((col) => (
            <span key={col.key} className="applicant-table-cell">{col.label}</span>
          ))}
        </div>

        {data.length === 0 ? (
          <div className="applicant-table-empty">No candidates match the current filters.</div>
        ) : (
          data.map((candidate, idx) => (
            <motion.div
              key={candidate.id}
              className={`applicant-table-row${isInterviewStatus(candidate.status) ? " applicant-table-row--disabled" : ""}`}
              style={{ gridTemplateColumns: gridTemplate }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.2 }}
              onClick={() => onRowClick?.(candidate)}
            >
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