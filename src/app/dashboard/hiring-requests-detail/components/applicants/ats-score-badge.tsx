import { ATS_SCORE_TOOLTIP } from "./applicants.constants";

type AtsScoreBadgeProps = {
  score?: number;
  onShowTooltip: (e: React.MouseEvent<HTMLDivElement>, lines: string[], className?: string) => void;
  onHideTooltip: () => void;
};

function scoreTone(score: number): string {
  if (score >= 70) return "score-high";
  if (score >= 40) return "score-mid";
  return "score-low";
}

const AtsScoreBadge = ({ score, onShowTooltip, onHideTooltip }: AtsScoreBadgeProps) => {
  const hasScore = score != null && Number.isFinite(score);
  const tone = hasScore ? scoreTone(score) : "score-empty";

  return (
    <div
      className={`ats-score-badge ats-score ${tone}`}
      onMouseEnter={(e) => onShowTooltip(e, [ATS_SCORE_TOOLTIP], "info-chip-tooltip--wide")}
      onMouseLeave={onHideTooltip}
      title={ATS_SCORE_TOOLTIP}
    >
      <span className="ats-score-badge__label">ATS</span>
      <span className="ats-score-badge__value">{hasScore ? score : "—"}</span>
    </div>
  );
};

export default AtsScoreBadge;
