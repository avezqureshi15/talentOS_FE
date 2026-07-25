import { motion } from "framer-motion";
import "./candidate-table.css";
import type { CandidateTableProps } from "./candidate-table.types";

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

const CandidateTable = ({ data, onRowClick }: CandidateTableProps) => {
  return (
    <div className="candidate-table-wrapper">
      <div className="applicant-table">
        <div className="applicant-table-header">
          <span className="applicant-table-cell applicant-table-cell--name">Candidate</span>
          <span className="applicant-table-cell applicant-table-cell--score">Score</span>
          <span className="applicant-table-cell applicant-table-cell--status">Status</span>
          <span className="applicant-table-cell applicant-table-cell--round">Round</span>
        </div>

        {data.length === 0 ? (
          <div className="applicant-table-empty">No candidates match the current filters.</div>
        ) : (
          data.map((candidate, idx) => (
            <motion.div
              key={candidate.id}
              className="applicant-table-row"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.2 }}
              onClick={() => onRowClick?.(candidate)}
            >
              <div className="applicant-table-cell applicant-table-cell--name">
                <div className="candidate-avatar">{getInitials(candidate.name)}</div>
                <div>
                  <div className="candidate-name">{candidate.name}</div>
                  {candidate.email && <div className="candidate-email">{candidate.email}</div>}
                </div>
              </div>
              <div className="applicant-table-cell applicant-table-cell--score">
                {candidate.score != null ? (
                  <span className={`ats-score ${getScoreClass(candidate.score)}`}>
                    {candidate.score}
                  </span>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </div>
              <div className="applicant-table-cell applicant-table-cell--status">
                {(() => {
                  const ds = getDisplayStatus(candidate.score, candidate.status);
                  return <span className={`status-chip status-chip--${ds.cssClass}`}>{ds.label}</span>;
                })()}
              </div>
              <div className="applicant-table-cell applicant-table-cell--round">
                {candidate.currentRoundId ? (
                  <span className="round-badge">{candidate.currentRoundId}</span>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default CandidateTable;
