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
  under_evaluation: "Completed",
  shortlisted: "Shortlisted",
  resume_shortlisted: "Resume Shortlisted",
  rejected: "Rejected",
  scheduled: "Scheduled",
  move_to_next_round: "Move to Next",
  waiting_for_review: "Waiting",
  selected: "Selected",
  screening_round_scheduled: "Screening Round Scheduled",
};

function getDisplayStatus(rawStatus: string): { label: string; cssClass: string } {
  return { label: STATUS_LABELS[rawStatus] ?? rawStatus, cssClass: rawStatus };
}

const isInterviewStatus = (s: string) =>
  s === "interview_scheduled" || s === "interview_rescheduled" || s === "interview_cancelled" || s === "screening_round_scheduled";

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
    const ds = getDisplayStatus(c.status);
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

const CandidateTable = ({
  data, columns, onRowClick, onInfoClick,
  showBulkSelection, selectedIds, isBulkProcessing,
  onToggleSelect, onToggleSelectAll, onClearSelection,
  onBulkMoveToScreening, onBulkMoveToInterview, selectionCount, allSelected,
}: CandidateTableProps) => {
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

      {showBulkSelection && (selectionCount ?? 0) > 0 && (
        <div className="bulk-action-bar">
          <span className="bulk-action-count">{selectionCount} candidate{selectionCount !== 1 ? "s" : ""} selected</span>
          <div className="bulk-action-buttons">
            <button
              className="btn screen-btn compact"
              onClick={onBulkMoveToScreening}
              disabled={isBulkProcessing}
              type="button"
            >
              {isBulkProcessing ? <i className="bx bx-loader-alt bx-spin" /> : <i className="bx bx-phone" />}
              {" "}Move to AI Screening
            </button>
            <button
              className="btn screen-btn compact"
              onClick={onBulkMoveToInterview}
              disabled={isBulkProcessing}
              type="button"
            >
              {isBulkProcessing ? <i className="bx bx-loader-alt bx-spin" /> : <i className="bx bx-bot" />}
              {" "}Move to AI Interview
            </button>
            <button
              className="bulk-action-clear"
              onClick={onClearSelection}
              disabled={isBulkProcessing}
              type="button"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateTable;