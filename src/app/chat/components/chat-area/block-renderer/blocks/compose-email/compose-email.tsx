import React, { useState } from "react";
import "./compose-email.css";
import { UI_LABELS } from "@/constants/constants";
import { DEFAULT_SUBJECT, DEFAULT_BODY, HR_EMAIL } from "./compose-email.constants";

const ComposeEmail: React.FC = () => {
  const [subject, setSubject] = useState(DEFAULT_SUBJECT); // UI state for email subject field
  const [body, setBody] = useState(DEFAULT_BODY); // UI state for email body textarea

  const [isSending, setIsSending] = useState(false); // UI state for send-in-progress flag
  const [sent, setSent] = useState(false); // UI state for sent confirmation flag
  const [showToast, setShowToast] = useState(false); // UI state for toast notification visibility
  const [hideCard, setHideCard] = useState(false); // UI state for card fade-out animation

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
      setSubject(DEFAULT_SUBJECT);
      setBody(DEFAULT_BODY);
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
            {HR_EMAIL}
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