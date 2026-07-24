import { APPLICANT_LABELS } from "@/constants/constants";
import ApplicantActionBar from "./applicant-action-bar";
import CardDetailsTab from "./card-details-tab";
import CardCoverLetterTab from "./card-cover-letter-tab";
import CardAiSummaryTab from "./card-ai-summary-tab";
import CardRoundsTab from "./card-rounds-tab";
import type { CardExpandedContentProps } from "./applicants.types";

const CardExpandedContent = ({
  applicant: a,
  stateConfig,
  accordionTab,
  onTabChange,
  onTimeline,
  onViewRound,
  isRemote = false,
}: CardExpandedContentProps) => (
  <div className="accordion-body">
    <ApplicantActionBar
      phone={a.phone}
      linkedinUrl={a.linkedinUrl}
      cvUrl={a.cvUrl}
      onTimeline={() => onTimeline(a.candidateId)}
    />

    <div className="accordion-tabs block">
      <button
        className={`accordion-tab ${accordionTab === "details" ? "accordion-tab--active" : ""}`}
        onClick={() => onTabChange("details")}
        type="button"
      >
        <i className="bx bx-detail" aria-hidden /> {APPLICANT_LABELS.DETAILS}
      </button>
      <button
        className={`accordion-tab ${accordionTab === "cover-letter" ? "accordion-tab--active" : ""}`}
        onClick={() => onTabChange("cover-letter")}
        type="button"
      >
        <i className="bx bx-notepad" aria-hidden /> {APPLICANT_LABELS.COVER_LETTER}
      </button>
      <button
        className={`accordion-tab ${accordionTab === "ai-summary" ? "accordion-tab--active" : ""}`}
        onClick={() => onTabChange("ai-summary")}
        type="button"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" />
        </svg>
        {APPLICANT_LABELS.AI_SUMMARY}
      </button>
      <button
        className={`accordion-tab ${accordionTab === "rounds" ? "accordion-tab--active" : ""}`}
        onClick={() => onTabChange("rounds")}
        type="button"
      >
        <i className="bx bx-repeat" aria-hidden /> {APPLICANT_LABELS.ROUNDS}
      </button>
    </div>

    {accordionTab === "details" && <CardDetailsTab applicant={a} isRemote={isRemote} />}
    {accordionTab === "cover-letter" && <CardCoverLetterTab coverLetter={a.coverLetter ?? ""} />}
    {accordionTab === "rounds" && (
      <CardRoundsTab
        candidateId={a.candidateId}
        currentRoundId={a.currentRoundId}
        reviewVerdict={a.reviewVerdict}
        onViewRound={onViewRound}
      />
    )}
    {accordionTab === "ai-summary" && (
      <CardAiSummaryTab aiSummary={a.aiSummary ?? ""} reviews={a.reviews} />
    )}

    {stateConfig.footerBadge && (
      <div className={stateConfig.footerBadge.className}>{stateConfig.footerBadge.text}</div>
    )}
  </div>
);

export default CardExpandedContent;
