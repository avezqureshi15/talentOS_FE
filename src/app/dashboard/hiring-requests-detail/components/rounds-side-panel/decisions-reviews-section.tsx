import { useState } from "react";
import Chip from "@/components/ui/chip/chip";
import ReadMoreText from "./read-more-text";
import ExpandableAiSummary from "./expandable-ai-summary";
import ReviewDecisionSummary from "./review-decision-summary";
import ReviewFullAnswers from "./review-full-answers";
import { hasDecisionSummary } from "./review-mappers";
import type { ReviewEntity } from "./rounds-side-panel.types";
import {
  ROUNDS_PANEL_LABELS,
  ROUNDS_FALLBACK,
  VERDICT_LABELS,
  VERDICT_ICONS,
  ENTITY_TITLE_LABELS,
  CRITERION_LABELS,
  COMPARISON_LABELS,
} from "./rounds-side-panel.constants";

function EntityAiContent({ entity }: { entity: ReviewEntity }) {
  const hasBullets = entity.strongMatches.length > 0 || entity.gapsAndConcerns.length > 0;
  const hasComparisons = entity.comparisonFields.length > 0;
  const hasDetails = entity.rejectionDetails.length > 0;
  const hasAiContent = entity.summary || hasBullets || hasComparisons || hasDetails;
  if (!hasAiContent) return null;

  return (
    <div className="rp-ai-summary md-content">
      {entity.summary ? (
        <ExpandableAiSummary text={entity.summary} />
      ) : hasBullets || hasComparisons ? null : !hasDetails ? (
        <p className="rp-ai-empty">{ROUNDS_FALLBACK.NO_AI_SUMMARY}</p>
      ) : null}
      {hasComparisons && (
        <>
          <span className="rp-ai-subheading">JD vs Candidate Comparison</span>
          <div className="rp-comparison-fields">
            {entity.comparisonFields.map((f, i) => (
              <div key={i} className="rp-comparison-field">
                <span className="rp-comparison-label">{COMPARISON_LABELS[f.label] ?? f.label}</span>
                <div className="rp-comparison-compare">
                  <div className="rp-comparison-col">
                    <span className="rp-comparison-col-label">Required</span>
                    <span className="rp-comparison-value rp-comparison-value--expected">{f.expected}</span>
                  </div>
                  <div className="rp-comparison-col">
                    <span className="rp-comparison-col-label">Actual</span>
                    <span className="rp-comparison-value rp-comparison-value--actual">{f.actual}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {hasDetails && (
        <>
          <span className="rp-ai-subheading">Rejection Reasons</span>
          <div className="rp-rejection-details">
            {entity.rejectionDetails.map((item, i) => {
              const key = Object.keys(item)[0];
              const detail = item[key];
              return (
                <div key={i} className="rp-rejection-detail">
                  <span className="rp-rejection-detail-criterion">
                    {CRITERION_LABELS[key] ?? key}
                  </span>
                  <div className="rp-rejection-detail-compare">
                    <div className="rp-rejection-detail-col">
                      <span className="rp-rejection-detail-label">Required</span>
                      <span className="rp-rejection-detail-value rp-rejection-detail-value--jd">{detail.JD}</span>
                    </div>
                    <div className="rp-rejection-detail-col">
                      <span className="rp-rejection-detail-label">Candidate</span>
                      <span className="rp-rejection-detail-value rp-rejection-detail-value--candidate">{detail.Candidate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {entity.strongMatches.length > 0 && (
        <>
          <span className="rp-ai-subheading">Strong Matches</span>
          <ul>{entity.strongMatches.map((m, i) => <li key={i}>{m}</li>)}</ul>
        </>
      )}
      {entity.gapsAndConcerns.length > 0 && (
        <>
          <span className="rp-ai-subheading">Gaps & Concerns</span>
          <ul>{entity.gapsAndConcerns.map((g, i) => <li key={i}>{g}</li>)}</ul>
        </>
      )}
    </div>
  );
}

function AiReviewBlock({ entity }: { entity: ReviewEntity }) {
  const title = ENTITY_TITLE_LABELS[entity.entityType] ?? entity.entityType;
  const hasContent =
    !!entity.verdict ||
    entity.ratings.length > 0 ||
    entity.skills.length > 0 ||
    !!entity.notes ||
    !!entity.remarks ||
    !!entity.summary ||
    entity.strongMatches.length > 0 ||
    entity.gapsAndConcerns.length > 0 ||
    entity.comparisonFields.length > 0 ||
    entity.rejectionDetails.length > 0;

  if (!hasContent) return null;

  return (
    <div className="rp-decision-card">
      <div className="rp-decision-header">
        <span className="rp-decision-label">{title}</span>
        {entity.verdict && (
          <span className={`rp-pill rp-pill--${entity.verdict}`}>
            <i className={VERDICT_ICONS[entity.verdict] ?? "bx bx-help-circle"} aria-hidden />
            {VERDICT_LABELS[entity.verdict] ?? entity.verdict}
          </span>
        )}
      </div>
      {entity.skills.length > 0 && (
        <div className="rp-skills">
          {entity.skills.map((s) => (
            <Chip key={s} variant="secondary" size="sm">
              {s}
            </Chip>
          ))}
        </div>
      )}
      {entity.notes && <p className="rp-notes">{entity.notes}</p>}
      <EntityAiContent entity={entity} />
      {entity.remarks && (
        <span className="rp-row-value">
          <ReadMoreText text={entity.remarks} />
        </span>
      )}
    </div>
  );
}

function InterviewerReviewBlock({ entity }: { entity: ReviewEntity }) {
  const [fullOpen, setFullOpen] = useState(false);
  const title = ENTITY_TITLE_LABELS[entity.entityType] ?? entity.entityType;

  if (!hasDecisionSummary(entity) && !entity.notes && !entity.remarks) return null;

  return (
    <div className="rp-decision-card">
      {hasDecisionSummary(entity) && (
        <ReviewDecisionSummary
          entity={entity}
          title={title}
          fullOpen={fullOpen}
          onToggleFull={() => setFullOpen((prev) => !prev)}
        />
      )}
      {fullOpen && <ReviewFullAnswers entity={entity} />}
      {entity.notes && <p className="rp-notes">{entity.notes}</p>}
      {entity.remarks && (
        <span className="rp-row-value">
          <ReadMoreText text={entity.remarks} />
        </span>
      )}
    </div>
  );
}

function ReviewEntityBlock({ entity }: { entity: ReviewEntity }) {
  if (entity.entityType === "ai") {
    return <AiReviewBlock entity={entity} />;
  }
  return <InterviewerReviewBlock entity={entity} />;
}

type DecisionsReviewsSectionProps = {
  reviews: ReviewEntity[];
};

/** Right-pane (or stacked) Decisions & Reviews block. */
const DecisionsReviewsSection = ({ reviews }: DecisionsReviewsSectionProps) => (
  <div className="rp-group">
    <span className="rp-group-title">{ROUNDS_PANEL_LABELS.DECISIONS}</span>
    <div className="rp-decision-cards">
      {reviews.map((entity, i) => (
        <ReviewEntityBlock key={`${entity.entityType}-${i}`} entity={entity} />
      ))}
    </div>
  </div>
);

export default DecisionsReviewsSection;
