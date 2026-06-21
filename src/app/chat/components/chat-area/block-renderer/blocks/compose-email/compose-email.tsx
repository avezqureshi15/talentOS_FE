import React, { useState } from "react";
import "./compose-email.css";
import { UI_LABELS } from "@/constants/constants";

const ComposeEmail: React.FC = () => {
  const [subject, setSubject] = useState("Connecting regarding [Topic]");
  const [body, setBody] = useState(`Hi Avez,

I hope you are doing well.

I am writing to connect with you regarding [insert topic/purpose of your email here].`);

  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [hideCard, setHideCard] = useState(false);

  const handleSend = () => {
    if (isSending) return;

    setIsSending(true);
    setSent(true);

    setTimeout(() => {
      setHideCard(true);
      setShowToast(true);

      setTimeout(() => setShowToast(false), 2200);

      setTimeout(() => {
        setHideCard(false);
        setIsSending(false);
        setSent(false);
      }, 2600);
    }, 500);
  };

  const handleCancel = () => {
    setHideCard(true);

    setTimeout(() => {
      setSubject("Connecting regarding [Topic]");
      setBody(`Hi Avez,

I hope you are doing well.

I am writing to connect with you regarding [insert topic/purpose of your email here].`);
      setHideCard(false);
    }, 300);
  };

  return (
    <div className="ce-container">
      <div className={`ce-card ${hideCard ? "fade-out" : "fade-up"}`}>
        
        {/* Header */}
        <div className="ce-header">
          <span className="ce-title">{UI_LABELS.COMPOSE}</span>
        </div>

        {/* To */}
        <div className="ce-row">
          <span className="ce-label">To</span>

          <div className="ce-chip">
            <div className="ce-avatar">A</div>
            avez@webknot.in
            <span className="ce-chip-close">×</span>
          </div>

          <div className="ce-cc">
            <span>Cc</span>
            <span>Bcc</span>
          </div>
        </div>

        {/* Subject */}
        <div className="ce-input-row">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
          />
        </div>

        {/* Body */}
        <div className="ce-textarea">
          <textarea
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        {/* Footer */}
        <div className="ce-footer">
          <button className="ce-link-btn">{UI_LABELS.EDIT_IN_GMAIL}</button>

          <div className="ce-actions">
            <button className="ce-cancel" onClick={handleCancel}>
              {UI_LABELS.CANCEL}
            </button>

            <button
              className={`ce-send ${isSending ? "sending" : ""} ${
                sent ? "sent" : ""
              }`}
              onClick={handleSend}
              disabled={isSending}
            >
              {sent ? UI_LABELS.SENT : UI_LABELS.SEND}
            </button>
          </div>
        </div>
      </div>

      {showToast && <div className="ce-toast">{UI_LABELS.MESSAGE_SENT}</div>}
    </div>
  );
};

export default ComposeEmail;