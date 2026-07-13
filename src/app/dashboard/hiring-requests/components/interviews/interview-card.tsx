import { INTERVIEW_ROOM_LABEL, RESCHEDULE_LABEL, CANCEL_INTERVIEW_LABEL } from "./interviews.constants";
import type { InterviewCardProps } from "./interviews.types";
import "./interview-card.css";

const InterviewCard = ({ interview, isOpen, onToggleOpen, onReschedule, onCancel, onNavigateToApplicant }: InterviewCardProps) => {

  return (
    <div className="interview-card">
      <div className="interview-header">
        <div className="interview-header-left" onClick={() => onToggleOpen(interview.id)}>
          <div className="name">{interview.roundName}</div>
          <div className="meta">
            <span><i className="bx bx-user" /> {interview.candidateName}</span>
            <span><i className="bx bx-briefcase" /> {interview.position}</span>
          </div>
        </div>

        <div className="interview-header-center">
          <span className="slot-pill">
            <i className="bx bx-clock-five" />
            {interview.slotDate}, {interview.slotTime}
          </span>
          <a href={interview.roomLink} target="_blank" rel="noreferrer" className="room-btn" onClick={(e) => e.stopPropagation()}>
            <i className="bx bx-video" /> {INTERVIEW_ROOM_LABEL} <i className="bx bx-chevron-right" />
          </a>
        </div>

        <div className="interview-header-right">
          <button
            className="reschedule-btn"
            onClick={(e) => { e.stopPropagation(); onReschedule(interview.candidateName, interview.candidateId, interview.id, interview.interviewerEmpId, interview.interviewerName, interview.roundName); }}
            type="button"
          >
            <i className="bx bx-calendar" /> {RESCHEDULE_LABEL}
          </button>
          <button
            className="cancel-btn"
            onClick={(e) => { e.stopPropagation(); onCancel(interview.candidateName); }}
            title={CANCEL_INTERVIEW_LABEL}
            type="button"
          >
            <i className="bx bx-x" />
          </button>
          <button
            className="info-toggle"
            onClick={(e) => { e.stopPropagation(); onNavigateToApplicant(interview.hiringRequestId, interview.candidateId); }}
            title="Candidate Info"
            type="button"
          >
            <i className="bx bx-info-circle" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="interview-body">
          <div className="interview-table">
            <div className="interview-table-cell">
              <span className="interview-table-label"><i className="bx bx-user" /> Interviewer</span>
              <span className="interview-table-value">{interview.interviewerName}</span>
            </div>
            <div className="interview-table-cell">
              <span className="interview-table-label"><i className="bx bx-user-voice" /> Candidate</span>
              <span className="interview-table-value">{interview.candidateName}</span>
            </div>
            <div className="interview-table-cell">
              <span className="interview-table-label"><i className="bx bx-briefcase" /> Position</span>
              <span className="interview-table-value">{interview.position}</span>
            </div>
            <div className="interview-table-cell">
              <span className="interview-table-label"><i className="bx bx-layer" /> Round</span>
              <span className="interview-table-value">{interview.roundName}</span>
            </div>
            <div className="interview-table-cell">
              <span className="interview-table-label"><i className="bx bx-time-five" /> Slot Timing</span>
              <span className="interview-table-value">{interview.slotDate}, {interview.slotTime}</span>
            </div>
            <div className="interview-table-cell interview-table-cell--full">
              <span className="interview-table-label"><i className="bx bx-video" /> Interview Room</span>
              <span className="interview-table-value"><a href={interview.roomLink} target="_blank" rel="noreferrer">{interview.roomLink}</a></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewCard;
