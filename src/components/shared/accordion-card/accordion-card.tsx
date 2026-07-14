import { useState, useCallback } from "react";
import { ACCORDION_LABELS } from "./accordion-card.constants";
import type { AccordionCardProps } from "./accordion-card.types";
import "./accordion-card.css";

const AccordionCard = ({
  id, name, email, contactNumber,
  linkHref, linkLabel,
  isOpen, onToggleOpen,
  jdHref, jdLabel,
  interviewLabel, onViewInterview,
  onResolve, onNotify, onNotifyError,
}: AccordionCardProps) => {
  const [notified, setNotified] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [notifyError, setNotifyError] = useState<string | null>(null);
  const [resolved, setResolved] = useState(false);

  const handleNotify = useCallback(async () => {
    if (!onNotify || notifying || notified) return;
    setNotifying(true);
    setNotifyError(null);
    try {
      await onNotify();
      setNotified(true);
      setTimeout(() => setNotified(false), 2000);
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error("Notification failed");
      setNotifyError(e.message);
      onNotifyError?.(e);
      setTimeout(() => setNotifyError(null), 3000);
    } finally {
      setNotifying(false);
    }
  }, [onNotify, notifying, notified]);

  const handleResolve = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onResolve) {
      onResolve(id);
    } else {
      setResolved((prev) => !prev);
    }
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
          <div className="notify-wrapper">
            <button
              className={`notify-btn${notified ? " notify-btn--sent" : ""}${notifying ? " notify-btn--loading" : ""}${notifyError ? " notify-btn--error" : ""}`}
              onClick={(e) => { e.stopPropagation(); handleNotify(); }}
              disabled={notifying}
              type="button"
            >
              <i className={`bx ${notified ? "bx-check" : notifying ? "bx-loader-alt bx-spin" : "bx-bell"}`} />
              {notified ? ACCORDION_LABELS.NOTIFICATION_SENT : ACCORDION_LABELS.SEND_NOTIFICATION}
            </button>
            {notifyError && <span className="notify-error-tooltip">{notifyError}</span>}
          </div>
          <button
            className={`resolve-btn${resolved ? " resolve-btn--done" : ""}`}
            onClick={handleResolve}
            type="button"
          >
            <i className={`bx ${resolved ? "bx-check-circle" : "bx-check"}`} />
            {resolved ? ACCORDION_LABELS.RESOLVED : ACCORDION_LABELS.RESOLVE}
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
