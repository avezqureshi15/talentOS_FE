import {
  REVIEW_PHASE_MAX_SCORE,
  formatScoreLabel,
  scoreTone,
} from "./review-phases-accordion.helpers";
import "./review-score-chip.css";

type ReviewScoreChipProps = {
  score: number;
  maxScore?: number;
  className?: string;
};

/**
 * Soft tinted score pill (green / yellow / red).
 * Tone comes from scoreTone() so bands stay centralized.
 */
const ReviewScoreChip = ({
  score,
  maxScore = REVIEW_PHASE_MAX_SCORE,
  className = "",
}: ReviewScoreChipProps) => {
  const tone = scoreTone(score, maxScore);
  const label = formatScoreLabel(score, maxScore);

  return (
    <span
      className={`rpa-score-chip rpa-score-chip--${tone} ${className}`.trim()}
      title={label}
    >
      {label}
    </span>
  );
};

export default ReviewScoreChip;
