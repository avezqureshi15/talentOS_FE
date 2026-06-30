import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { INTERVIEW_SUB_TABS, MOCK_INTERVIEWS, NO_INTERVIEWS_LABEL } from "./interviews.constants";
import type { InterviewSubTab } from "./interviews.types";
import InterviewCard from "./interview-card";
import ScheduleRoundModal from "@/app/dashboard/hiring-requests-detail/components/schedule-round/schedule-round-modal";
import CancelInterviewModal from "./cancel-interview-modal";
import "./interviews.css";

const Interviews = () => {
  const navigate = useNavigate();
  const [sub, setSub] = useState<InterviewSubTab>("incoming");
  const [openId, setOpenId] = useState<string | null>(null);
  const [rescheduleFor, setRescheduleFor] = useState<{ candidateName: string; candidateId: string } | null>(null);
  const [cancelCandidate, setCancelCandidate] = useState<string | null>(null);

  const filtered = MOCK_INTERVIEWS.filter((iv) =>
    sub === "incoming" ? iv.slotDate !== "Yesterday" : iv.slotDate === "Yesterday"
  );

  const handleReschedule = useCallback((candidateName: string, candidateId: string) => {
    setRescheduleFor({ candidateName, candidateId });
  }, []);

  const handleScheduled = useCallback((_candidateId: string) => {
    setRescheduleFor(null);
  }, []);

  const handleCancelStart = useCallback((candidateName: string) => {
    setCancelCandidate(candidateName);
  }, []);

  const handleCancelConfirm = useCallback(() => {
    setCancelCandidate(null);
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
            onClick={() => { setSub(st.key); setOpenId(null); }}
            type="button"
          >
            <i className={st.icon} />
            {st.label}
          </button>
        ))}
      </div>

      <div className="accordion-list">
        {filtered.length === 0 ? (
          <div className="hr-tab-placeholder">{NO_INTERVIEWS_LABEL}</div>
        ) : (
          filtered.map((iv) => (
            <InterviewCard
              key={iv.id}
              interview={iv}
              isOpen={openId === iv.id}
              onToggleOpen={(id) => setOpenId(openId === id ? null : id)}
              onReschedule={handleReschedule}
              onCancel={handleCancelStart}
              onNavigateToApplicant={handleNavigateToApplicant}
            />
          ))
        )}
      </div>

      {rescheduleFor && (
        <ScheduleRoundModal
          open
          candidateName={rescheduleFor.candidateName}
          candidateId={rescheduleFor.candidateId}
          onClose={() => setRescheduleFor(null)}
          onScheduled={handleScheduled}
        />
      )}

      {cancelCandidate && (
        <CancelInterviewModal
          open
          candidateName={cancelCandidate}
          onClose={() => setCancelCandidate(null)}
          onConfirm={handleCancelConfirm}
        />
      )}
    </div>
  );
};

export default Interviews;
