import { useState } from "react";
import { APPLICANT_LABELS } from "@/constants/constants";
import CardDetailsTab from "./card-details-tab";
import CardCoverLetterTab from "./card-cover-letter-tab";
import CardAiSummaryTab from "./card-ai-summary-tab";
import CardRoundsTab from "./card-rounds-tab";
import type { CardExpandedContentProps } from "./applicants.types";

function screeningFailureLabel(callOutcome?: string): string {
  switch (callOutcome) {
    case "no_answer": return "Unable to reach candidate — no answer";
    case "voicemail": return "Reached voicemail — candidate didn't pick up";
    case "declined":  return "Candidate declined the call";
    case "dropped":   return "Call was dropped before completing";
    case "failed":    return "Call failed to connect";
    default:          return "Screening call could not be completed";
  }
}

type ScreeningBannerProps = {
  reason: string;
  detail?: string;
};

const ScreeningBanner = ({ reason, detail }: ScreeningBannerProps) => {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="screening-failure-banner" role="alert">
      <i className="bx bx-error-circle screening-failure-icon" aria-hidden />
      <div className="screening-failure-content">
        <p className="screening-failure-reason">{reason}</p>
        {detail && expanded && <p className="screening-failure-detail">{detail}</p>}
      </div>
      <div className="screening-failure-actions">
        {detail && (
          <button
            type="button"
            className="screening-failure-toggle"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded ? "Hide" : "Details"}
          </button>
        )}
        <button
          type="button"
          className="screening-failure-dismiss"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss alert"
        >
          <i className="bx bx-x" aria-hidden />
        </button>
      </div>
    </div>
  );
};

const CardExpandedContent = ({
  applicant: a,
  stateConfig,
  accordionTab,
  onTabChange,
  onDetailsReadMore,
  onCoverLetterReadMore,
  onAiSummaryReadMore,
  jdId,
  showAllDetails = false,
  variant = "inline",
}: CardExpandedContentProps) => {
  const isPanel = variant === "panel";

  return (
    <div className={`accordion-body${isPanel ? " accordion-body--panel" : ""}`}>
      {a.status === "ai_screening_evaluation_failed" && a.screeningReview && (
        <ScreeningBanner
          reason={screeningFailureLabel(a.screeningReview.callOutcome)}
          detail={a.screeningReview.endedReason ? `Call ended: ${a.screeningReview.endedReason}` : undefined}
        />
      )}
      {a.status === "ai_screening_flagged" && a.screeningReview && (
        <ScreeningBanner
          reason={
            a.screeningReview.flagReason ??
            a.screeningReview.summary ??
            "AI screening flagged — review the candidate manually"
          }
        />
      )}
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

      <div className="accordion-panel" key={accordionTab}>
        {accordionTab === "details" && (
          <CardDetailsTab
            applicant={a}
            onDetailsReadMore={onDetailsReadMore}
            showAll={showAllDetails}
            variant={variant}
          />
        )}
        {accordionTab === "cover-letter" && (
          <CardCoverLetterTab
            coverLetter={a.coverLetter ?? ""}
            applicantId={a.id}
            onReadMore={onCoverLetterReadMore}
            variant={variant}
          />
        )}
        {accordionTab === "rounds" && <CardRoundsTab candidateId={a.candidateId} jdId={jdId} />}
        {accordionTab === "ai-summary" && (
          <CardAiSummaryTab
            aiSummary={a.aiSummary ?? ""}
            applicantId={a.id}
            onReadMore={onAiSummaryReadMore}
            reviews={a.reviews}
            showFull={showAllDetails}
            variant={variant}
          />
        )}
      </div>

      {stateConfig.footerBadge && (
        <div className={stateConfig.footerBadge.className}>{stateConfig.footerBadge.text}</div>
      )}
    </div>
  );
};

export default CardExpandedContent;
