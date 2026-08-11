import { useState } from "react";
import DataTable from "@/components/ui/data-table/data-table";
import { TruncatedCell } from "@/components/shared/truncated-cell/truncated-cell";
import ScheduleRoundModal from "@/app/dashboard/hiring-requests-detail/components/schedule-round/schedule-round-modal";
import CancelInterviewModal from "@/app/dashboard/hiring-requests/components/interviews/cancel-interview-modal";
import { useInterviewsByHr } from "./use-interviews-by-hr";
import { PAGINATION } from "@/constants/api-endpoints";
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

const PER_PAGE = PAGINATION.INTERVIEWS_PER_PAGE;

const InterviewsTable = ({ hiringRequestId, subTab, onInfoClick }: Props) => {
  const statusFilter = SUB_FILTER_MAP[subTab] ?? "incoming";
  const { interviews, total, isLoading, page, setPage, refresh } = useInterviewsByHr(hiringRequestId, statusFilter);

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
      <DataTable
        columns={[
          { header: "Round Name", render: (row) => <TruncatedCell text={row.roundName} className="dt-cell-name" /> },
          {
            header: "Candidate Name",
            className: "it-candidate-cell",
            render: (row) => <TruncatedCell text={row.candidateName} className="dt-cell-name" />,
          },
          { header: "Interviewer", render: (row) => <TruncatedCell text={row.interviewerName} /> },
          {
            header: "Timing",
            render: (row) => (
              <div className="it-timing-cell">
                <span className="it-date">{row.slotDate}</span>
                <span className="it-time">{row.slotTime}</span>
              </div>
            ),
          },
          {
            header: "",
            className: "dt-cell-center",
            render: (row) => (
              <button
                className="info-icon-btn"
                onClick={(e) => { e.stopPropagation(); onInfoClick?.(row.candidateId); }}
                title="Candidate Info"
                type="button"
              >
                <i className="bx bx-info-circle" />
              </button>
            ),
          },
          ...(!isCancelled
            ? [
                {
                  header: "Actions",
                  className: "it-actions-cell",
                  render: (row: typeof interviews[number]) => (
                    <div className="it-actions-cell">
                      <button className="it-action-btn it-action-btn--reschedule" onClick={() => handleReschedule(row)} type="button">
                        <i className="bx bx-calendar" /> Reschedule
                      </button>
                      <button className="it-action-btn it-action-btn--cancel" onClick={() => handleCancel(row)} type="button">
                        <i className="bx bx-x" /> Cancel
                      </button>
                    </div>
                  ),
                },
              ]
            : []),
        ]}
        data={interviews}
        loading={isLoading}
        keyExtractor={(row) => row.id}
        emptyMessage={
          subTab === "yet-to-start"
            ? "No upcoming interviews found."
            : "No cancelled interviews found."
        }
        gridTemplateColumns={isCancelled ? "1.5fr 1.5fr 1.2fr 1.2fr 32px" : "1.5fr 1.5fr 1.2fr 1.2fr 32px 1fr"}
        rowClassName={() => (isCancelled ? "it-row--cancelled" : "")}
        pagination={{
          page,
          perPage: PER_PAGE,
          total,
          totalPages: Math.max(Math.ceil(total / PER_PAGE), page),
          onPageChange: setPage,
        }}
        animated
      />

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
