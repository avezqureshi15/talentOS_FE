import Chip from "@/components/ui/chip/chip";
import ExpandableAiSummary from "@/app/dashboard/hiring-requests-detail/components/rounds-side-panel/expandable-ai-summary";
import ReadMoreText from "@/app/dashboard/hiring-requests-detail/components/rounds-side-panel/read-more-text";
import ReviewPhasesAccordion from "@/app/dashboard/hiring-requests-detail/components/review-phases-accordion/review-phases-accordion";
import { normalizeReviewPhases } from "@/app/dashboard/hiring-requests-detail/components/review-phases-accordion/review-phases-accordion.helpers";
import type { ReviewEntity, RatingItem } from "@/services/applications/applications.types";
import {
  RATING_LABELS, ENTITY_TITLE_LABELS, VERDICT_LABELS, VERDICT_ICONS,
  CRITERION_LABELS, COMPARISON_LABELS, ROUNDS_FALLBACK,
} from "@/app/dashboard/hiring-requests-detail/components/rounds-side-panel/rounds-side-panel.constants";
import { extractComparisonFields } from "./normal-round-template.utils";

const AI_ENTITY_TYPES_HANDLED_ELSEWHERE = new Set<string>(["ai_screening", "ai_interview"]);

const ReviewSection = ({ entity }: { entity: ReviewEntity }) => {
  if (AI_ENTITY_TYPES_HANDLED_ELSEWHERE.has(entity.entity_type)) return null;

  const title = ENTITY_TITLE_LABELS[entity.entity_type] ?? entity.entity_type;
  const isAi = entity.entity_type === "ai";
  const ratings = entity.ratings as RatingItem[];
  const phases = normalizeReviewPhases(entity.phases);
  const skills = entity.skills as string[] | undefined;
  const notes = entity.notes as string | undefined;
  const remarks = entity.remarks as string | undefined;
  const averageRating = typeof entity.average_rating === "number"
    ? entity.average_rating
    : undefined;

  const shouldRender =
    phases.length > 0
    || ratings.length > 0
    || (skills?.length ?? 0) > 0
    || !!notes
    || !!remarks
    || isAi;
  if (!shouldRender) return null;

  const headerIcon = isAi
    ? "bx bx-brain"
    : entity.entity_type === "interviewer" ? "bx bx-user-check" : "bx bx-building";

  return (
    <section className="nrt-card">
      <div className="nrt-card-header">
        <i className={headerIcon} />
        <span>{title}</span>
        {entity.verdict && (
          <span className={`nrt-pill nrt-pill--${entity.verdict}`}>
            <i className={VERDICT_ICONS[entity.verdict] ?? "bx bx-help-circle"} />
            {VERDICT_LABELS[entity.verdict] ?? entity.verdict}
          </span>
        )}
      </div>
      <div className="nrt-card-body">
        {phases.length > 0 ? (
          <ReviewPhasesAccordion phases={phases} averageRating={averageRating} />
        ) : (
          ratings.length > 0 && <ScoreGrid ratings={ratings} />
        )}

        {skills && skills.length > 0 && (
          <div className="nrt-skills">
            {skills.map((s, i) => <Chip key={i} variant="secondary" size="sm">{s}</Chip>)}
          </div>
        )}

        {notes && <div className="nrt-text-block"><span className="nrt-text-label">Notes</span><p>{notes}</p></div>}

        {isAi && <AiContent entity={entity} />}

        {remarks && <div className="nrt-text-block"><span className="nrt-text-label">Remarks</span><ReadMoreText text={remarks} /></div>}
      </div>
    </section>
  );
};

const ScoreGrid = ({ ratings }: { ratings: RatingItem[] }) => {
  const avg = ratings.length > 0
    ? (ratings.reduce((s, r) => s + r.score, 0) / ratings.length).toFixed(1)
    : "0.0";
  const maxScore = ratings[0]?.max_score ?? 5;
  const labelMap = RATING_LABELS as Record<string, string>;

  return (
    <div className="nrt-score-section">
      <div className="nrt-score-grid">
        {ratings.map((r, i) => {
          const pct = maxScore > 0 ? Math.round((r.score / maxScore) * 100) : 0;
          const label = labelMap[r.label] ?? (r.label === "fitscore" ? "ATS Score" : r.label);
          return (
            <div key={i} className="nrt-score-item">
              <div className="nrt-score-item-header">
                <span className="nrt-score-item-label">{label}</span>
                <span className="nrt-score-item-value">{r.score}<span className="nrt-score-item-denom">/{maxScore}</span></span>
              </div>
              <div className="nrt-score-bar-track">
                <div className="nrt-score-bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="nrt-score-avg">
        Average: <strong>{avg}</strong> / {maxScore}
      </div>
    </div>
  );
};

const AiContent = ({ entity }: { entity: ReviewEntity }) => {
  const summary = entity.summary as string | undefined;
  const strongMatches = Array.isArray(entity.strong_matches) ? entity.strong_matches as string[] : [];
  const gapsAndConcerns = Array.isArray(entity.gaps_and_concerns) ? entity.gaps_and_concerns as string[] : [];
  const comparisonFields = extractComparisonFields(entity);
  const rejectionDetails = Array.isArray(entity.rejection_details) ? entity.rejection_details as Array<Record<string, { JD: string; Candidate: string }>> : [];
  const hasBullets = strongMatches.length > 0 || gapsAndConcerns.length > 0;
  const hasComparisons = comparisonFields.length > 0;
  const hasDetails = rejectionDetails.length > 0;
  const hasAiContent = summary || hasBullets || hasComparisons || hasDetails;
  if (!hasAiContent) return null;

  return (
    <div className="nrt-ai-content">
      {summary ? (
        <ExpandableAiSummary text={summary} />
      ) : hasBullets || hasComparisons ? null : !hasDetails ? (
        <p className="nrt-ai-empty">{ROUNDS_FALLBACK.NO_AI_SUMMARY}</p>
      ) : null}

      {hasComparisons && (
        <div className="nrt-compact-section">
          <span className="nrt-compact-label">JD vs Candidate Comparison</span>
          <div className="nrt-compare-grid">
            {comparisonFields.map((f, i) => (
              <div key={i} className="nrt-compare-field">
                <span className="nrt-compare-title">{COMPARISON_LABELS[f.label] ?? f.label}</span>
                <div className="nrt-compare-pair">
                  <span className="nrt-compare-exp">JD: {f.expected}</span>
                  <span className="nrt-compare-act">Candidate: {f.actual}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasDetails && (
        <div className="nrt-compact-section">
          <span className="nrt-compact-label">Rejection Reasons</span>
          <div className="nrt-compare-grid">
            {rejectionDetails.map((item, i) => {
              const key = Object.keys(item)[0];
              const detail = item[key];
              return (
                <div key={i} className="nrt-compare-field">
                  <span className="nrt-compare-title">{CRITERION_LABELS[key] ?? key}</span>
                  <div className="nrt-compare-pair">
                    <span className="nrt-compare-exp">JD: {detail.JD}</span>
                    <span className="nrt-compare-act">Candidate: {detail.Candidate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {strongMatches.length > 0 && (
        <div className="nrt-compact-section">
          <span className="nrt-compact-label">Strong Matches</span>
          <ul className="nrt-bullet-list">{strongMatches.map((m, i) => <li key={i}>{m}</li>)}</ul>
        </div>
      )}

      {gapsAndConcerns.length > 0 && (
        <div className="nrt-compact-section">
          <span className="nrt-compact-label">Gaps & Concerns</span>
          <ul className="nrt-bullet-list nrt-bullet-list--danger">{gapsAndConcerns.map((g, i) => <li key={i}>{g}</li>)}</ul>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
