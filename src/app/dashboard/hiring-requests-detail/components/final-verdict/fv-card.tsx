import { APPLICANT_LABELS } from "@/constants/constants";
import { formatDate } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.utils";
import CardDetailsTab from "@/app/dashboard/hiring-requests-detail/components/applicants/card-details-tab";
import CardCoverLetterTab from "@/app/dashboard/hiring-requests-detail/components/applicants/card-cover-letter-tab";
import CardAiSummaryTab from "@/app/dashboard/hiring-requests-detail/components/applicants/card-ai-summary-tab";
import CardRoundsTab from "@/app/dashboard/hiring-requests-detail/components/applicants/card-rounds-tab";
import type { Applicant, AccordionTab } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

const AI_LABEL: Record<string, string> = {
  shortlisted: APPLICANT_LABELS.AI_SHORTLISTED,
  rejected: APPLICANT_LABELS.AI_REJECTED,
  pending: APPLICANT_LABELS.AI_PENDING,
};

type FvCardProps = {
  applicant: Applicant;
  isOpen: boolean;
  accordionTab: AccordionTab;
  onToggleOpen: (id: string) => void;
  onTabChange: (tab: AccordionTab) => void;
  onCoverLetterReadMore: (id: string) => void;
  onAiSummaryReadMore: (id: string) => void;
  onDetailsReadMore: (id: string) => void;
  onTimeline: (id: string) => void;
  onViewRound: (roundId: string) => void;
};

const FvCard = ({
  applicant: a,
  isOpen,
  accordionTab,
  onToggleOpen,
  onTabChange,
  onCoverLetterReadMore,
  onAiSummaryReadMore,
  onDetailsReadMore,
  onTimeline,
  onViewRound,
}: FvCardProps) => (
  <div className="accordion-card">
    <div className="accordion-header">
      <div className="header-left" onClick={() => onToggleOpen(a.id)}>
        <div className="name">{a.name}</div>
        <div className="meta">
          {a.email && <span><i className="bx bx-envelope" /> {a.email}</span>}
          {a.appliedAt && (
            <span className="applied-date">
              <i className="bx bx-calendar" /> {APPLICANT_LABELS.APPLIED} {formatDate(a.appliedAt)}
            </span>
          )}
        </div>
      </div>

      <div className="header-right">
        {a.aiDecision && a.aiDecision !== "pending" && (
          <span className={`ai-chip ai-chip--${a.aiDecision}`}>
            <i className={`bx ${a.aiDecision === "shortlisted" ? "bx-check-circle" : "bx-x-circle"}`} />
            {AI_LABEL[a.aiDecision]}
          </span>
        )}

        {a.score != null && (
          <div className={`ats-score ${a.score >= 70 ? "score-high" : a.score >= 40 ? "score-mid" : "score-low"}`}>
            {a.score}
          </div>
        )}
      </div>
    </div>

    {isOpen && (
      <div className="accordion-body">
        <div className="action-links">
          {a.phone && <a href={`tel:${a.phone}`} className="action-link"><i className="bx bx-phone" /> {a.phone}</a>}
          <a href={a.linkedinUrl} target="_blank" rel="noreferrer" className="action-link"><i className="bx bx-link-alt" /> {APPLICANT_LABELS.LINKEDIN}</a>
          <a href={a.cvUrl} target="_blank" rel="noreferrer" className="action-link"><i className="bx bx-file" /> {APPLICANT_LABELS.CV}</a>
          <button className="action-link action-link-btn" onClick={(e) => { e.stopPropagation(); onTimeline(a.id); }}>
            <i className="bx bx-clock" /> {APPLICANT_LABELS.TIMELINE}
          </button>
        </div>

        <div className="accordion-tabs block">
          <button className={`accordion-tab ${accordionTab === "details" ? "accordion-tab--active" : ""}`} onClick={() => onTabChange("details")} type="button">
            <i className="bx bx-detail" /> {APPLICANT_LABELS.DETAILS}
          </button>
          <button className={`accordion-tab ${accordionTab === "cover-letter" ? "accordion-tab--active" : ""}`} onClick={() => onTabChange("cover-letter")} type="button">
            <i className="bx bx-notepad" /> {APPLICANT_LABELS.COVER_LETTER}
          </button>
          <button className={`accordion-tab ${accordionTab === "ai-summary" ? "accordion-tab--active" : ""}`} onClick={() => onTabChange("ai-summary")} type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" /></svg>
            {APPLICANT_LABELS.AI_SUMMARY}
          </button>
          <button className={`accordion-tab ${accordionTab === "rounds" ? "accordion-tab--active" : ""}`} onClick={() => onTabChange("rounds")} type="button">
            <i className="bx bx-repeat" /> {APPLICANT_LABELS.ROUNDS}
          </button>
        </div>

        {accordionTab === "details" && <CardDetailsTab applicant={a} onDetailsReadMore={onDetailsReadMore} />}
        {accordionTab === "cover-letter" && <CardCoverLetterTab coverLetter={a.coverLetter ?? ""} applicantId={a.id} onReadMore={onCoverLetterReadMore} />}
        {accordionTab === "rounds" && <CardRoundsTab candidateId={a.candidateId} onViewRound={onViewRound} />}
        {accordionTab === "ai-summary" && <CardAiSummaryTab aiSummary={a.aiSummary ?? ""} applicantId={a.id} onReadMore={onAiSummaryReadMore} />}

        {a.status === "rejected" && <div className="rejected-text">{APPLICANT_LABELS.CANDIDATE_REJECTED}</div>}
        {a.status === "hired" && <div className="hired-text">{APPLICANT_LABELS.CANDIDATE_HIRED}</div>}
      </div>
    )}
  </div>
);

export default FvCard;
