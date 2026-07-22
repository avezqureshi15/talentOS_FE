import "./hero-score-card.css";
import type { HeroScoreCardProps } from "./hero-score-card.types";

const RING_CLASS: Record<string, string> = {
  REJECT: "hsc-score-ring--reject",
  ADVANCE: "hsc-score-ring--advance",
  POTENTIAL_FIT: "hsc-score-ring--potential",
};

const PILL_CLASS: Record<string, string> = {
  REJECT: "hsc-ai-pill--reject",
  ADVANCE: "hsc-ai-pill--advance",
  POTENTIAL_FIT: "hsc-ai-pill--potential",
};

const PROGRESS_CLASS: Record<string, string> = {
  REJECT: "hsc-progress-fill--reject",
  ADVANCE: "hsc-progress-fill--advance",
  POTENTIAL_FIT: "hsc-progress-fill--potential",
};


const HeroScoreCard = ({ aiRecommendation, overallScore, criteriaMet, totalCriteria, aiSummary }: HeroScoreCardProps) => {
  const progress = totalCriteria > 0 ? (criteriaMet / totalCriteria) * 100 : 0;

  return (
    <div className="hsc-card">
      <div className="hsc-top">
        <div className="hsc-left-col">
          <span className="hsc-ai-label">AI SUGGESTS</span>
          <span className={`hsc-ai-pill ${PILL_CLASS[aiRecommendation]}`}>
            {aiRecommendation === "POTENTIAL_FIT" ? "POTENTIAL FIT" : aiRecommendation}
          </span>
        </div>
        <div className={`hsc-score-ring ${RING_CLASS[aiRecommendation]}`}>
          <span className="hsc-stamp-title">SCORE</span>
          <span className="hsc-score-value">{overallScore}</span>
          <div className="hsc-score-denom-row">
            <span className="hsc-score-denom">/ 5.0</span>
            <i className="bx bxs-info-circle hsc-info-icon" />
          </div>
          <span className="hsc-stamp-footer">webHyre.ai</span>
        </div>
      </div>
      <div className="hsc-assessment-area">
        <span className="hsc-assessment-label">Assessment</span>
        <div className="hsc-summary">&ldquo;{aiSummary}&rdquo;</div>
        <div className="hsc-criteria-row">
          <span className="hsc-criteria-text">Criteria Met: {criteriaMet} of {totalCriteria}</span>
          <div className="hsc-progress-bar">
            <div className={`hsc-progress-fill ${PROGRESS_CLASS[aiRecommendation]}`} style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroScoreCard;
