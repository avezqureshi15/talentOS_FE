import { useState } from "react";
import { ACCORDION_LABELS } from "./accordion-card.constants";
import type { AccordionCardProps } from "./accordion-card.types";
import "./accordion-card.css";

const AccordionCard = ({
  id, name, email, contactNumber,
  linkHref, linkLabel,
  isOpen, onToggleOpen,
  jdHref, jdLabel,
  interviewLabel, onViewInterview,
}: AccordionCardProps) => {
  const [notified, setNotified] = useState(false);

  const handleNotify = () => {
    setNotified(true);
    setTimeout(() => setNotified(false), 2000);
  };

  return (
    <div className="accordion-card">
      <div className="accordion-header">
        <div className="header-left" onClick={() => onToggleOpen(id)}>
          <div className="name">{name}</div>
          <div className="meta">
            <span><i className="bx bx-envelope" /> {email}</span>
          </div>
        </div>

        <div className="accordion-header-right">
          <button
            className={`notify-btn${notified ? " notify-btn--sent" : ""}`}
            onClick={(e) => { e.stopPropagation(); handleNotify(); }}
            type="button"
          >
            <i className={`bx ${notified ? "bx-check" : "bx-bell"}`} />
            {notified ? ACCORDION_LABELS.NOTIFICATION_SENT : ACCORDION_LABELS.SEND_NOTIFICATION}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="accordion-body">
          <div className="detail-grid">
            <div className="detail-row">
              <span className="detail-label"><i className="bx bx-phone" /> {ACCORDION_LABELS.CONTACT}</span>
              <span className="detail-value">{contactNumber}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label"><i className="bx bx-link" /> {linkLabel}</span>
              <a href={linkHref} target="_blank" rel="noreferrer" className="detail-value detail-link">{linkHref}</a>
            </div>
            {jdHref && (
              <div className="detail-row">
                <span className="detail-label"><i className="bx bx-file" /> {jdLabel ?? ACCORDION_LABELS.JD}</span>
                <a href={jdHref} className="detail-value detail-link">{jdHref}</a>
              </div>
            )}
            {onViewInterview && (
              <div className="detail-row">
                <span className="detail-label"><i className="bx bx-user-voice" /> {interviewLabel ?? ACCORDION_LABELS.VIEW_INTERVIEW}</span>
                <button className="interview-link" onClick={onViewInterview} type="button">
                  {ACCORDION_LABELS.VIEW_INTERVIEW} <i className="bx bx-chevron-right" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccordionCard;
