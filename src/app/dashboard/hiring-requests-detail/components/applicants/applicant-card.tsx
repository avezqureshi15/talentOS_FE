import { truncateText, formatDate } from "./applicants.utils";
import { APPLICANT_LABELS } from "@/constants/constants";
import type { Applicant, AccordionTab } from "./applicants.types";

type ApplicantCardProps = {
  applicant: Applicant;
  isOpen: boolean;
  isScreening: boolean;
  accordionTab: AccordionTab;
  onToggleOpen: (id: string) => void;
  onStartScreening: (id: string) => void;
  onReject: (id: string) => void;
  onAccept: (id: string) => void;
  onTabChange: (tab: AccordionTab) => void;
  onCoverLetterReadMore: (id: string) => void;
  onAiSummaryReadMore: (id: string) => void;
  onTimeline: (id: string) => void;
};

const ApplicantCard = ({
  applicant: a,
  isOpen,
  isScreening,
  accordionTab,
  onToggleOpen,
  onStartScreening,
  onReject,
  onAccept,
  onTabChange,
  onCoverLetterReadMore,
  onAiSummaryReadMore,
  onTimeline,
}: ApplicantCardProps) => {
  const cl = a.coverLetter ? truncateText(a.coverLetter, 50) : null;
  const aiSum = a.aiSummary ? truncateText(a.aiSummary, 50) : null;

  return (
    <div className="accordion-card">
      <div className="accordion-header">
        <div className="header-left" onClick={() => onToggleOpen(a.id)}>
          <div className="name">{a.name}</div>
          <div className="meta">
            {a.email && <span><i className="bx bx-envelope"></i> {a.email}</span>}
            {a.appliedAt && (
              <span className="applied-date">
                <i className="bx bx-calendar"></i> {APPLICANT_LABELS.APPLIED} {formatDate(a.appliedAt)}
              </span>
            )}
          </div>
        </div>

        <div className="header-right">
          {a.status === "reviewing" && <div className="queue-text mb-30">{APPLICANT_LABELS.QUEUING}</div>}
          <div className={`status-dot ${a.status}`} />

          {a.status === "new" && !isScreening && (
            <button className="screen-btn compact" onClick={(e) => { e.stopPropagation(); onStartScreening(a.id); }}>
              {APPLICANT_LABELS.START_SCREENING}
            </button>
          )}

          {a.status === "new" && isScreening && (
            <>
              <button className="btn reject compact" onClick={(e) => { e.stopPropagation(); onReject(a.id); }}>
                {APPLICANT_LABELS.REJECT}
              </button>
              <button className="btn accept compact" onClick={(e) => { e.stopPropagation(); onAccept(a.id); }}>
                {APPLICANT_LABELS.ACCEPT}
              </button>
            </>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="accordion-body">
          <div className="action-links">
            {a.phone && <a href={`tel:${a.phone}`} className="action-link"><i className="bx bx-phone"></i> {a.phone}</a>}
            <a href={a.linkedinUrl} target="_blank" rel="noreferrer" className="action-link"><i className="bx bx-link-alt"></i> {APPLICANT_LABELS.LINKEDIN}</a>
            <a href={a.cvUrl} target="_blank" rel="noreferrer" className="action-link"><i className="bx bx-file"></i> {APPLICANT_LABELS.CV}</a>
            <button className="action-link action-link-btn" onClick={(e) => { e.stopPropagation(); onTimeline(a.id); }}>
              <i className="bx bx-clock"></i> {APPLICANT_LABELS.TIMELINE}
            </button>
          </div>

          <div className="accordion-tabs block">
            <button
              className={`accordion-tab ${accordionTab === "cover-letter" ? "accordion-tab--active" : ""}`}
              onClick={() => onTabChange("cover-letter")}
              type="button"
            >
              <i className="bx bx-notepad" />
              {APPLICANT_LABELS.COVER_LETTER}
            </button>
            <button
              className={`accordion-tab ${accordionTab === "ai-summary" ? "accordion-tab--active" : ""}`}
              onClick={() => onTabChange("ai-summary")}
              type="button"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" /></svg>
              {APPLICANT_LABELS.AI_SUMMARY}
            </button>
          </div>

          {accordionTab === "cover-letter" && (
            <div className="cover-letter">
              <div className="cover-letter-label">
                <i className="bx bx-notepad"></i>
                {APPLICANT_LABELS.COVER_LETTER}
              </div>
              {cl ? (
                <p className="cover-letter-text">
                  {cl.text}
                  {cl.truncated && (
                    <button className="read-more" onClick={(e) => { e.stopPropagation(); onCoverLetterReadMore(a.id); }}>
                      {APPLICANT_LABELS.READ_MORE}
                    </button>
                  )}
                </p>
              ) : (
                <p className="cover-letter-text">{APPLICANT_LABELS.NO_COVER_LETTER}</p>
              )}
            </div>
          )}

          {accordionTab === "ai-summary" && (
            <div className="cover-letter">
              <div className="cover-letter-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" /></svg>
                {APPLICANT_LABELS.AI_SUMMARY}
              </div>
              {aiSum ? (
                <p className="cover-letter-text">
                  {aiSum.text}
                  {aiSum.truncated && (
                    <button className="read-more" onClick={(e) => { e.stopPropagation(); onAiSummaryReadMore(a.id); }}>
                      {APPLICANT_LABELS.READ_MORE}
                    </button>
                  )}
                </p>
              ) : (
                <p className="cover-letter-text">{APPLICANT_LABELS.NO_AI_SUMMARY}</p>
              )}
            </div>
          )}

          {a.status === "rejected" && <div className="rejected-text">{APPLICANT_LABELS.CANDIDATE_REJECTED}</div>}
          {a.status === "hired" && <div className="hired-text">{APPLICANT_LABELS.CANDIDATE_HIRED}</div>}
        </div>
      )}
    </div>
  );
};

export default ApplicantCard;
