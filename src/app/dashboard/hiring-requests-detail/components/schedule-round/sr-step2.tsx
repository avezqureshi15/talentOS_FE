import { SR_LABELS } from "./schedule-round-modal.constants";

type SrStep2Props = {
  candidateName: string;
  interviewerName: string;
  interviewerRole: string;
  slotDate: string;
  slotTime: string;
  gmeetEnabled: boolean;
  onToggleGmeet: () => void;
  invitePreview: string;
};

const SrStep2 = ({ candidateName, interviewerName, interviewerRole, slotDate, slotTime, gmeetEnabled, onToggleGmeet, invitePreview }: SrStep2Props) => (
  <>
    <div className="sr-summary">
      <div className="sr-summary-row">
        <div className="sr-summary-icon"><i className="bx bx-user" /></div>
        <div className="sr-summary-content">
          <span className="sr-summary-label">{SR_LABELS.CANDIDATE_LABEL}</span>
          <span className="sr-summary-value">{candidateName}</span>
        </div>
      </div>
      <div className="sr-summary-row">
        <div className="sr-summary-icon"><i className="bx bx-briefcase" /></div>
        <div className="sr-summary-content">
          <span className="sr-summary-label">{SR_LABELS.INTERVIEWER_LABEL}</span>
          <span className="sr-summary-value">{interviewerName} &middot; {interviewerRole}</span>
        </div>
      </div>
      <div className="sr-summary-row">
        <div className="sr-summary-icon"><i className="bx bx-calendar" /></div>
        <div className="sr-summary-content">
          <span className="sr-summary-label">{SR_LABELS.DATE_LABEL}</span>
          <span className="sr-summary-value">{slotDate}</span>
        </div>
      </div>
      <div className="sr-summary-row">
        <div className="sr-summary-icon"><i className="bx bx-stopwatch" /></div>
        <div className="sr-summary-content">
          <span className="sr-summary-label">{SR_LABELS.TIME_LABEL}</span>
          <span className="sr-summary-value">{slotTime}</span>
        </div>
      </div>
    </div>

    <hr className="sr-gmeet-divider" />

    <div className="sr-gmeet-row">
      <span className="sr-gmeet-label"><i className="bx bx-video" /> {SR_LABELS.GMEET_TOGGLE}</span>
      <button className={`sr-toggle ${gmeetEnabled ? "sr-toggle--on" : ""}`} onClick={onToggleGmeet} type="button">
        <span className="sr-toggle-knob" />
      </button>
    </div>

    <textarea className="sr-invite-preview" readOnly value={gmeetEnabled ? invitePreview : invitePreview.replace("A Google Meet link has", "A calendar invite has")} />
  </>
);

export default SrStep2;
