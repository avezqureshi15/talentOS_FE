import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { INTERVIEW_SUB_TABS, NO_INTERVIEWS_LABEL } from "./interviews.constants";
import type { InterviewSubTab } from "./interviews.types";
import { useInterviewsData } from "./hooks/use-interviews-data";
import InterviewCard from "./interview-card";
import ScheduleRoundModal from "@/app/dashboard/hiring-requests-detail/components/schedule-round/schedule-round-modal";
import CancelInterviewModal from "./cancel-interview-modal";
import "./interviews.css";

const Interviews = () => {
  const navigate = useNavigate();
  const [sub, setSub] = useState<InterviewSubTab>("incoming");
  const [openId, setOpenId] = useState<string | null>(null);
  const [rescheduleFor, setRescheduleFor] = useState<{ candidateName: string; candidateId: string; interviewId: string; interviewerEmpId: string; interviewerName: string; roundName: string } | null>(null);
  const [cancelTarget, setCancelTarget] = useState<{ candidateName: string; interviewId: string } | null>(null);

  const { interviews, hasMore, isLoading, page, setPage } = useInterviewsData(sub);

  const handleReschedule = useCallback((candidateName: string, candidateId: string, interviewId: string, interviewerEmpId: string, interviewerName: string, roundName: string) => {
    setRescheduleFor({ candidateName, candidateId, interviewId, interviewerEmpId, interviewerName, roundName });
  }, []);

  const handleScheduled = useCallback((_candidateId: string) => {
    setRescheduleFor(null);
  }, []);

  const handleCancelStart = useCallback((candidateName: string, interviewId: string) => {
    setCancelTarget({ candidateName, interviewId });
  }, []);

  const handleCancelConfirm = useCallback(() => {
    setCancelTarget(null);
  }, []);

  const handleNavigateToApplicant = useCallback((hiringRequestId: string, candidateId: string) => {
    navigate(`/hiring-requests/${hiringRequestId}?applicant=${candidateId}`);
  }, [navigate]);

  return (
    <div className="interviews-content">
      <div className="interviews-tabs">
        {INTERVIEW_SUB_TABS.map((st) => (
          <button
            key={st.key}
            className={`interviews-tab${sub === st.key ? " interviews-tab--active" : ""}`}
            onClick={() => { setSub(st.key); setOpenId(null); setPage(1); }}
            type="button"
          >
            <i className={st.icon} />
            {st.label}
          </button>
        ))}
      </div>

      <div className="accordion-list">
        {isLoading ? (
          <div className="hr-tab-placeholder">Loading...</div>
        ) : interviews.length === 0 ? (
          <div className="hr-tab-placeholder">{NO_INTERVIEWS_LABEL}</div>
        ) : (
          <>
            {interviews.map((iv) => (
              <InterviewCard
                key={iv.id}
                interview={iv}
                isOpen={openId === iv.id}
                onToggleOpen={(id) => setOpenId(openId === id ? null : id)}
                onReschedule={handleReschedule}
                onCancel={handleCancelStart}
                onNavigateToApplicant={handleNavigateToApplicant}
              />
            ))}
            <div className="pagination-row">
              <button
                className="pagination-btn"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                type="button"
              >
                <i className="bx bx-chevron-left" /> Previous
              </button>
              <span className="pagination-info">Page {page}</span>
              <button
                className="pagination-btn"
                disabled={!hasMore}
                onClick={() => setPage(page + 1)}
                type="button"
              >
                Next <i className="bx bx-chevron-right" />
              </button>
            </div>
          </>
        )}
      </div>

      {rescheduleFor && (
        <ScheduleRoundModal
          open
          rescheduleMode={true}
          interviewId={rescheduleFor.interviewId}
          interviewerEmpId={rescheduleFor.interviewerEmpId}
          interviewerName={rescheduleFor.interviewerName}
          roundName={rescheduleFor.roundName}
          candidateName={rescheduleFor.candidateName}
          candidateId={rescheduleFor.candidateId}
          onClose={() => setRescheduleFor(null)}
          onScheduled={handleScheduled}
        />
      )}

      {cancelTarget && (
        <CancelInterviewModal
          open
          interviewId={cancelTarget.interviewId}
          candidateName={cancelTarget.candidateName}
          onClose={() => setCancelTarget(null)}
          onConfirm={handleCancelConfirm}
        />
      )}
    </div>
  );
};

export default Interviews;
