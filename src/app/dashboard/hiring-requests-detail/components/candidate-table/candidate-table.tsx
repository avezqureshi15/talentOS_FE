import { useMemo } from "react";
import { motion } from "framer-motion";
import "./candidate-table.css";
import type { CandidateTableProps } from "./candidate-table.types";
import { STAGE_COLUMNS, SCORE_PILLS, MOCK_CANDIDATES } from "./candidate-table.constants";

const getDeadlineClass = (deadline?: string) => {
  if (!deadline) return "deadline-pill--normal";
  const diff = (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return "deadline-pill--danger";
  if (diff < 3) return "deadline-pill--warning";
  return "deadline-pill--normal";
};

const formatDeadline = (deadline?: string) => {
  if (!deadline) return "—";
  const diff = Math.round((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return `passed ${Math.abs(diff)}d ago`;
  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  return `${diff}d left`;
};

const getScorePill = (score: number) =>
  SCORE_PILLS.find((s) => score > s.max || (score <= s.max && score > (SCORE_PILLS[SCORE_PILLS.indexOf(s) + 1]?.max ?? -1))) ?? SCORE_PILLS[2];

const getInitials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const timeElapsed = (startedAt?: string) => {
  if (!startedAt) return "—";
  const diff = Math.round((Date.now() - new Date(startedAt).getTime()) / (1000 * 60));
  if (diff < 60) return `${diff}m`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  return `${Math.floor(diff / 1440)}d`;
};

const CandidateTable = ({ stage, data: propData, selectedIds, onSelectionChange, onRowClick, subFilter }: CandidateTableProps) => {
  const columns = STAGE_COLUMNS[stage];
  const gridTemplate = `40px ${columns.map((c) => c.width).join(" ")}`;
  const data = propData.length > 0 ? propData : MOCK_CANDIDATES[stage];

  const filteredData = useMemo(() => {
    if (stage !== "evaluated" || !subFilter || subFilter === "all") return data;
    if (subFilter === "completed") return data.filter((c) => c.results && c.results.length > 0);
    return data.filter((c) => c.partialProgress);
  }, [data, stage, subFilter]);

  const toggleAll = () => {
    if (selectedIds.size === filteredData.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(filteredData.map((c) => c.id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  };

  const renderCell = (candidate: (typeof data)[number], key: string) => {
    switch (key) {
      case "candidate":
        return (
          <div className="candidate-cell">
            <div className="candidate-avatar">{getInitials(candidate.name)}</div>
            <div>
              <div className="candidate-name">{candidate.name}</div>
              {candidate.email && <div className="candidate-email">{candidate.email}</div>}
            </div>
          </div>
        );
      case "addedBy":
        return <span>{candidate.addedBy ?? "—"}</span>;
      case "addedAt":
        return <span>{candidate.addedAt ?? "—"}</span>;
      case "openingDate":
        return <span>{candidate.openingDate ?? "—"}</span>;
      case "deadline": {
        const cls = getDeadlineClass(candidate.deadline);
        return <span className={`deadline-pill ${cls}`}>{formatDeadline(candidate.deadline)}</span>;
      }
      case "startedAt":
        return <span>{candidate.startedAt ?? "—"}</span>;
      case "timeElapsed":
        return <span>{timeElapsed(candidate.startedAt)}</span>;
      case "status":
        return candidate.status ? (
          <span className={`status-chip status-chip--${candidate.status === "In Progress" ? "info" : "warning"}`}>
            {candidate.status}
          </span>
        ) : <span>—</span>;
      case "results": {
        if (candidate.results && candidate.results.length > 0) {
          const r = candidate.results[0];
          const pill = getScorePill(r.score);
          return <span className={`score-pill ${pill.cls}`}>{r.score} {pill.label}</span>;
        }
        if (candidate.partialProgress) {
          return (
            <div className="partial-progress">
              <span className="partial-fraction">Partial {candidate.partialProgress.completed}/{candidate.partialProgress.total}</span>
              <button className="partial-resume-btn">Let Resume</button>
            </div>
          );
        }
        return <span>—</span>;
      }
      case "aiProctoring":
        if (candidate.aiProctoring === "cheating") {
          return (
            <span className="ai-proctoring-badge ai-proctoring-badge--cheating">
              <i className="bx bx-error-circle" /> Cheating
            </span>
          );
        }
        return <span className="ai-proctoring-badge ai-proctoring-badge--clean">—</span>;
      case "lastActivity":
        return <span>{candidate.lastActivity ?? "—"}</span>;
      case "archivedBy":
        return <span>{candidate.archivedBy ?? "—"}</span>;
      case "reason":
        return <span>{candidate.reason ?? "—"}</span>;
      case "archivedAt":
        return <span>{candidate.archivedAt ?? "—"}</span>;
      default:
        return <span>—</span>;
    }
  };

  return (
    <div className="candidate-table-wrapper">
      <div className="candidate-table">
        <div className="candidate-table-header" style={{ gridTemplateColumns: gridTemplate }}>
          <div className="candidate-checkbox" onClick={toggleAll}>
            {selectedIds.size === filteredData.length && filteredData.length > 0 && <i className="bx bx-check" />}
          </div>
          {columns.map((col) => (
            <div key={col.key}>{col.label}</div>
          ))}
        </div>

        {filteredData.length === 0 ? (
          <div className="candidate-table-empty">No candidates in this stage</div>
        ) : (
          filteredData.map((candidate, idx) => (
            <motion.div
              key={candidate.id}
              className="candidate-table-row"
              style={{ gridTemplateColumns: gridTemplate, animationDelay: `${idx * 0.04}s` }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.25 }}
              onClick={() => onRowClick?.(candidate)}
            >
              <div
                className={`candidate-checkbox ${selectedIds.has(candidate.id) ? "candidate-checkbox--checked" : ""}`}
                onClick={() => toggleOne(candidate.id)}
              >
                {selectedIds.has(candidate.id) && <i className="bx bx-check" />}
              </div>
              {columns.map((col) => (
                <div key={col.key} className="candidate-table-cell">
                  {renderCell(candidate, col.key)}
                </div>
              ))}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default CandidateTable;
