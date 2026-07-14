import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import PanelSkeleton from "./panel-skeleton";
import ReadMoreText from "./read-more-text";
import ExpandableAiSummary from "./expandable-ai-summary";
import { useRoundDetail } from "./use-round-detail";
import type { RoundsSidePanelProps, PanelContentProps, RowProps, ReviewEntity } from "./rounds-side-panel.types";
import {
  ROUNDS_PANEL_LABELS, ROUNDS_PANEL_STATUS, ROUNDS_FALLBACK,
  VERDICT_LABELS, VERDICT_ICONS, ENTITY_TITLE_LABELS, RATING_LABELS,
} from "./rounds-side-panel.constants";
import "./rounds-side-panel.css";

const RoundsSidePanel = ({ open, roundId, onClose, hideReviews }: RoundsSidePanelProps) => {
  const { data: round, isLoading, isFetching, isError, refetch } = useRoundDetail(roundId);

  return (
    <BaseModal open={open} onClose={onClose} title={ROUNDS_PANEL_LABELS.TITLE} variant="slide-right">
      {isLoading && <PanelSkeleton />}
      {isError && (
        <div className="rp-status rp-status--error">
          <p>{ROUNDS_PANEL_STATUS.ERROR}</p>
          <Button className="action-link action-link-btn" onClick={() => refetch()} loading={isFetching}>
            {ROUNDS_PANEL_STATUS.RETRY}
          </Button>
        </div>
      )}
      {round && <PanelContent round={round} hideReviews={hideReviews} />}
    </BaseModal>
  );
};

function EntityRatings({ entity }: { entity: ReviewEntity }) {
  if (entity.ratings.length === 0) return null;
  const avg = (entity.ratings.reduce((s, r) => s + r.score, 0) / entity.ratings.length).toFixed(1);
  const maxScore = entity.ratings[0].maxScore;
  return (
    <div className="rp-entity-ratings">
      <div className="rp-ratings">
        {entity.ratings.map((r, i) => (
          <div key={i} className="rp-rating-row">
            <span className="rp-rating-label">{RATING_LABELS[r.label] ?? (r.label === "fitscore" ? "ATS Score" : r.label)}</span>
            <span className="rp-rating-score">
              <span className="rp-score-earned">{r.score}</span>
              <span className="rp-score-sep">/</span>
              <span className="rp-score-total">{r.maxScore}</span>
            </span>
          </div>
        ))}
      </div>
      <span className="rp-avg">Average: <span className="rp-avg-earned">{avg}</span>/{maxScore}</span>
    </div>
  );
}

function EntityAiContent({ entity }: { entity: ReviewEntity }) {
  const hasBullets = entity.strongMatches.length > 0 || entity.gapsAndConcerns.length > 0;
  const hasAiContent = entity.summary || hasBullets || entity.rejectedStatus.length > 0 || entity.rejectedReason;
  if (!hasAiContent) return null;

  return (
    <div className="rp-ai-summary md-content">
      {entity.summary ? (
        <ExpandableAiSummary text={entity.summary} />
      ) : hasBullets ? null : entity.rejectedStatus.length === 0 && !entity.rejectedReason ? (
        <p className="rp-ai-empty">{ROUNDS_FALLBACK.NO_AI_SUMMARY}</p>
      ) : null}
      {entity.rejectedStatus.length > 0 && (
        <>
          <span className="rp-ai-subheading">Rejection Reasons</span>
          <div className="rp-rejection-chip-group">
            {entity.rejectedStatus.map((s, i) => (
              <span key={i} className="rp-rejection-chip">{s}</span>
            ))}
          </div>
        </>
      )}
      {entity.rejectedReason && <p className="rp-rejection-text">{entity.rejectedReason}</p>}
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

function EntitySkills({ skills }: { skills: string[] }) {
  if (skills.length === 0) return null;
  return (
    <div className="rp-skills">
      {skills.map((s, i) => <span key={i} className="rp-skill-chip">{s}</span>)}
    </div>
  );
}

function ReviewEntityBlock({ entity }: { entity: ReviewEntity }) {
  const title = ENTITY_TITLE_LABELS[entity.entityType] ?? entity.entityType;
  const hasRatings = entity.ratings.length > 0;
  const hasContent = hasRatings || entity.skills.length > 0 || entity.notes ||
    entity.remarks || entity.entityType === "ai";

  if (!hasContent) return null;

  return (
    <div className="rp-decision-card">
      <div className="rp-decision-header">
        <span className="rp-decision-label">{title}</span>
        {entity.verdict && (
          <span className={`rp-pill rp-pill--${entity.verdict}`}>
            <i className={VERDICT_ICONS[entity.verdict] ?? "bx bx-help-circle"} />
            {VERDICT_LABELS[entity.verdict] ?? entity.verdict}
          </span>
        )}
      </div>
      <EntityRatings entity={entity} />
      <EntitySkills skills={entity.skills} />
      {entity.notes && <p className="rp-notes">{entity.notes}</p>}
      {entity.entityType === "ai" && <EntityAiContent entity={entity} />}
      {entity.remarks && (
        <span className="rp-row-value"><ReadMoreText text={entity.remarks} /></span>
      )}
    </div>
  );
}

const PanelContent = ({ round, hideReviews }: PanelContentProps) => {
  if (!round) return null;

  return (
    <div className="rp-content">
      <span className="rp-badge">{round.round}</span>

      <div className="rp-divider" />

      <div className="rp-group">
        <span className="rp-group-title">Interview Info</span>
        <div className="rp-details">
          <Row label="Interviewer" icon="bx bx-user" value={round.interviewer} />
          <Row label="Hiring Role" icon="bx bx-briefcase" value={round.role} />
          {round.jdLabel && (
            <div className="rp-row">
              <span className="rp-row-label"><i className="bx bx-file" /> JD</span>
              <span className="rp-row-value"><ReadMoreText text={round.jdLabel} /></span>
            </div>
          )}
          <Row label="Candidate" icon="bx bx-user-voice" value={round.candidate} />
          <Row label="Occurred On" icon="bx bx-calendar" value={round.occurredOn} />
          <Row label="Slot" icon="bx bx-clock" value={round.slot} />
          <Row label="Duration" icon="bx bx-stopwatch" value={round.duration} />
          <Row label="Interview Type" icon="bx bx-video" value={round.interviewType} />
          <Row label="Status" icon="bx bx-check-circle" value={round.status} />
        </div>
      </div>

      {!hideReviews && round.reviews.length > 0 && (
        <>
          <div className="rp-divider" />
          <div className="rp-group">
            <span className="rp-group-title">Decisions & Reviews</span>
            <div className="rp-decision-cards">
              {round.reviews.map((entity, i) => (
                <ReviewEntityBlock key={i} entity={entity} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Row = ({ label, icon, value }: RowProps) => {
  if (!value) return null;
  return (
    <div className="rp-row">
      <span className="rp-row-label"><i className={icon} /> {label}</span>
      <span className="rp-row-value">{value}</span>
    </div>
  );
};

export default RoundsSidePanel;
