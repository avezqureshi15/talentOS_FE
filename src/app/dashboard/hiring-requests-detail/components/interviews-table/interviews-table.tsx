import { useState } from "react";
import { motion } from "framer-motion";
import ScheduleRoundModal from "@/app/dashboard/hiring-requests-detail/components/schedule-round/schedule-round-modal";
import CancelInterviewModal from "@/app/dashboard/hiring-requests/components/interviews/cancel-interview-modal";
import { useInterviewsByHr } from "./use-interviews-by-hr";
import "./interviews-table.css";

type Props = {
  hiringRequestId: string | undefined;
  subTab: "yet-to-start" | "no-show";
  onInfoClick?: (candidateId: string) => void;
};

const SUB_FILTER_MAP: Record<string, "incoming" | "cancelled"> = {
  "yet-to-start": "incoming",
  "no-show": "cancelled",
};

const InterviewsTable = ({ hiringRequestId, subTab, onInfoClick }: Props) => {
  const statusFilter = SUB_FILTER_MAP[subTab] ?? "incoming";
  const { interviews, isLoading, hasMore, page, setPage, refresh } = useInterviewsByHr(hiringRequestId, statusFilter);

  const [rescheduleTarget, setRescheduleTarget] = useState<{
    interviewId: string;
    candidateName: string;
    candidateId: string;
    interviewerEmpId: string;
    interviewerName: string;
    roundName: string;
  } | null>(null);

  const [cancelTarget, setCancelTarget] = useState<{
    interviewId: string;
    candidateName: string;
  } | null>(null);

  const handleReschedule = (row: typeof interviews[number]) => {
    setRescheduleTarget({
      interviewId: row.id,
      candidateName: row.candidateName,
      candidateId: row.candidateId,
      interviewerEmpId: row.interviewerEmpId,
      interviewerName: row.interviewerName,
      roundName: row.roundName,
    });
  };

  const handleCancel = (row: typeof interviews[number]) => {
    setCancelTarget({ interviewId: row.id, candidateName: row.candidateName });
  };

  const onScheduled = () => {
    setRescheduleTarget(null);
    refresh();
  };

  const onCancelled = () => {
    setCancelTarget(null);
    refresh();
  };

  const isCancelled = statusFilter === "cancelled";

  return (
    <div className="interviews-table-wrapper">
      <div className="applicant-table">
        <div className={`applicant-table-header it-header${isCancelled ? " it-header--cancelled" : ""}`}>
          <span className="applicant-table-cell">Round Name</span>
          <span className="applicant-table-cell">Candidate Name</span>
          <span className="applicant-table-cell">Interviewer</span>
          <span className="applicant-table-cell">Timing</span>
          <span className="applicant-table-cell applicant-table-cell--info" />
          {!isCancelled && <span className="applicant-table-cell it-actions-header">Actions</span>}
        </div>

        {isLoading ? (
          <div className="applicant-table-empty">Loading interviews...</div>
        ) : interviews.length === 0 ? (
          <div className="applicant-table-empty">No {subTab === "yet-to-start" ? "upcoming" : "cancelled"} interviews found.</div>
        ) : (
          interviews.map((row, idx) => (
            <motion.div
              key={row.id}
              className={`applicant-table-row${isCancelled ? " it-row--cancelled" : ""}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.2 }}
            >
              <div className="applicant-table-cell">{row.roundName}</div>
              <div className="applicant-table-cell it-candidate-cell">{row.candidateName}</div>
              <div className="applicant-table-cell">{row.interviewerName}</div>
              <div className="applicant-table-cell it-timing-cell">
                <span className="it-date">{row.slotDate}</span>
                <span className="it-time">{row.slotTime}</span>
              </div>
              <div className="applicant-table-cell applicant-table-cell--info">
                <button
                  className="info-icon-btn"
                  onClick={(e) => { e.stopPropagation(); onInfoClick?.(row.candidateId); }}
                  title="Candidate Info"
                  type="button"
                >
                  <i className="bx bx-info-circle" />
                </button>
              </div>
              {!isCancelled && (
                <div className="applicant-table-cell it-actions-cell">
                  <button className="it-action-btn it-action-btn--reschedule" onClick={() => handleReschedule(row)} type="button">
                    <i className="bx bx-calendar" /> Reschedule
                  </button>
                  <button className="it-action-btn it-action-btn--cancel" onClick={() => handleCancel(row)} type="button">
                    <i className="bx bx-x" /> Cancel
                  </button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {hasMore && (
        <div className="it-pagination">
          <button className="it-page-btn" disabled={page <= 1} onClick={() => setPage(page - 1)} type="button">Previous</button>
          <span className="it-page-info">Page {page}</span>
          <button className="it-page-btn" disabled={!hasMore} onClick={() => setPage(page + 1)} type="button">Next</button>
        </div>
      )}

      {rescheduleTarget && (
        <ScheduleRoundModal
          open
          rescheduleMode
          candidateName={rescheduleTarget.candidateName}
          candidateId={rescheduleTarget.candidateId}
          jdId={hiringRequestId}
          interviewId={rescheduleTarget.interviewId}
          interviewerEmpId={rescheduleTarget.interviewerEmpId}
          interviewerName={rescheduleTarget.interviewerName}
          roundName={rescheduleTarget.roundName}
          onClose={() => setRescheduleTarget(null)}
          onScheduled={onScheduled}
        />
      )}

      {cancelTarget && (
        <CancelInterviewModal
          open
          interviewId={cancelTarget.interviewId}
          candidateName={cancelTarget.candidateName}
          onClose={() => setCancelTarget(null)}
          onConfirm={onCancelled}
        />
      )}
    </div>
  );
};

export default InterviewsTable;
