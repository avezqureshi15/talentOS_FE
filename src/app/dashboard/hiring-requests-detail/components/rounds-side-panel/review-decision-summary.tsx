import Chip from "@/components/ui/chip/chip";
import type { ReviewEntity } from "./rounds-side-panel.types";
import { VERDICT_LABELS, VERDICT_ICONS, ROUNDS_FALLBACK } from "./rounds-side-panel.constants";
import { hasFullReviewContent, resolveAverage } from "./review-mappers";

type ReviewDecisionSummaryProps = {
  entity: ReviewEntity;
  title: string;
  fullOpen: boolean;
  onToggleFull: () => void;
};

const ReviewDecisionSummary = ({
  entity,
  title,
  fullOpen,
  onToggleFull,
}: ReviewDecisionSummaryProps) => {
  const average = resolveAverage(entity);
  const canViewFull = hasFullReviewContent(entity);

  return (
    <div className="rp-decision-summary">
      <div className="rp-decision-header">
        <span className="rp-decision-label">{title}</span>
        {entity.verdict && (
          <span className={`rp-pill rp-pill--${entity.verdict}`}>
            <i className={VERDICT_ICONS[entity.verdict] ?? "bx bx-help-circle"} aria-hidden />
            {VERDICT_LABELS[entity.verdict] ?? entity.verdict}
          </span>
        )}
      </div>

      {average && (
        <div className="rp-avg-row">
          <span className="rp-avg-label">Average</span>
          <span className="rp-avg">
            <span className="rp-avg-earned">{average.value.toFixed(1)}</span>
            <span className="rp-score-sep">/</span>
            <span className="rp-score-total">{average.maxScore}</span>
          </span>
        </div>
      )}

      {entity.skills.length > 0 && (
        <div className="rp-skills">
          {entity.skills.map((s) => (
            <Chip key={s} variant="secondary" size="sm">
              {s}
            </Chip>
          ))}
        </div>
      )}

      {canViewFull && (
        <button
          type="button"
          className="rp-view-full"
          onClick={onToggleFull}
          aria-expanded={fullOpen}
        >
          {fullOpen ? ROUNDS_FALLBACK.HIDE_FULL_REVIEW : ROUNDS_FALLBACK.VIEW_FULL_REVIEW}
          <i className={`bx ${fullOpen ? "bx-chevron-up" : "bx-chevron-down"}`} aria-hidden />
        </button>
      )}
    </div>
  );
};

export default ReviewDecisionSummary;
