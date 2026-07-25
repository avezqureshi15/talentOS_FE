import Chip from "@/components/ui/chip/chip";
import ReadMoreText from "@/app/dashboard/hiring-requests-detail/components/rounds-side-panel/read-more-text";
import ExpandableAiSummary from "@/app/dashboard/hiring-requests-detail/components/rounds-side-panel/expandable-ai-summary";
import type { RoundDetailApiResponse, ReviewEntity, RatingItem } from "@/services/applications/applications.types";
import {
  RATING_LABELS, ENTITY_TITLE_LABELS, VERDICT_LABELS, VERDICT_ICONS,
  CRITERION_LABELS, COMPARISON_LABELS, ROUNDS_FALLBACK,
} from "@/app/dashboard/hiring-requests-detail/components/rounds-side-panel/rounds-side-panel.constants";
import "./normal-round-template.css";

type NormalRoundTemplateProps = {
  data: RoundDetailApiResponse;
  candidateId?: string | null;
  hiringRequestId?: string;
};

const NormalRoundTemplate = ({ data, candidateId, hiringRequestId }: NormalRoundTemplateProps) => {
  const interviewTypeIcon = data.interview_type?.toLowerCase().includes("tech") ? "bx bx-code-alt" :
    data.interview_type?.toLowerCase().includes("hr") ? "bx bx-user-voice" : "bx bx-video";

  const handleCandidateClick = () => {
    if (candidateId && hiringRequestId) {
      window.open(`/hiring-requests/${hiringRequestId}/applications?applicant=${candidateId}&view=card`, "_blank");
    }
  };

  return (
    <div className="nrt-root">
      <header className="nrt-header">
        <h1 className="nrt-candidate-name" onClick={handleCandidateClick} style={{ cursor: candidateId && hiringRequestId ? "pointer" : "default" }}>{data.candidate ?? "Candidate"}</h1>
        {data.role && <span className="nrt-role-line">{data.role}</span>}
      </header>

      <div className="nrt-grid">
        <div className="nrt-main">
          {data.reviews.map((entity, i) => (
            <ReviewSection key={i} entity={entity} />
          ))}

          {data.jd_label && (
            <section className="nrt-card">
              <div className="nrt-card-header">
                <i className="bx bx-file" />
                <span>Job Description</span>
              </div>
              <div className="nrt-card-body">
                <ReadMoreText text={data.jd_label} maxLength={300} />
              </div>
            </section>
          )}
        </div>

        <aside className="nrt-sidebar">
          <section className="nrt-card">
            <div className="nrt-card-header">
              <i className="bx bx-info-circle" />
              <span>Interview Overview</span>
            </div>
            <div className="nrt-card-body nrt-overview-body">
              <OverviewItem icon="bx bx-user" label="Candidate" value={data.candidate} />
              <OverviewItem icon="bx bx-user-voice" label="Interviewer" value={data.interviewer} />
              <OverviewItem icon="bx bx-calendar" label="Occurred On" value={data.occurred_on} />
              <OverviewItem icon="bx bx-clock" label="Slot" value={data.slot} />
              <OverviewItem icon="bx bx-stopwatch" label="Duration" value={data.duration} />
              <OverviewItem icon={interviewTypeIcon} label="Type" value={data.interview_type} />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

function ReviewSection({ entity }: { entity: ReviewEntity }) {
  const title = ENTITY_TITLE_LABELS[entity.entity_type] ?? entity.entity_type;
  const isAi = entity.entity_type === "ai";
  const ratings = entity.ratings as RatingItem[];
  const skills = entity.skills as string[] | undefined;
  const notes = entity.notes as string | undefined;
  const remarks = entity.remarks as string | undefined;

  const shouldRender = ratings.length > 0 || (skills?.length ?? 0) > 0 || !!notes || !!remarks || isAi;
  if (!shouldRender) return null;

  return (
    <section className="nrt-card">
      <div className="nrt-card-header">
        <i className={isAi ? "bx bx-brain" : entity.entity_type === "interviewer" ? "bx bx-user-check" : "bx bx-building"} />
        <span>{title}</span>
        {entity.verdict && (
          <span className={`nrt-pill nrt-pill--${entity.verdict}`}>
            <i className={VERDICT_ICONS[entity.verdict] ?? "bx bx-help-circle"} />
            {VERDICT_LABELS[entity.verdict] ?? entity.verdict}
          </span>
        )}
      </div>
      <div className="nrt-card-body">
        {ratings.length > 0 && <ScoreGrid ratings={ratings} />}

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
}

function ScoreGrid({ ratings }: { ratings: RatingItem[] }) {
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
}

function AiContent({ entity }: { entity: ReviewEntity }) {
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
                  <span className="nrt-compare-exp">Required: {f.expected}</span>
                  <span className="nrt-compare-act">Actual: {f.actual}</span>
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
                    <span className="nrt-compare-exp">Required: {detail.JD}</span>
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
}

function OverviewItem({ icon, label, value }: { icon: string; label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="nrt-overview-row">
      <span className="nrt-overview-label"><i className={icon} /> {label}</span>
      <span className="nrt-overview-value">{value}</span>
    </div>
  );
}

const SKIP_COMPARISON_KEYS = new Set([
  "entity_type", "verdict", "ratings", "skills", "notes",
  "summary", "summary_md", "strong_matches", "gaps_and_concerns",
  "remarks", "rejection_details", "rejected_status", "rejected_reason",
  "average_rating",
]);

function extractComparisonFields(entity: ReviewEntity) {
  const fields: { label: string; actual: string; expected: string }[] = [];
  for (const key of Object.keys(entity)) {
    if (SKIP_COMPARISON_KEYS.has(key)) continue;
    const val = entity[key];
    if (val && typeof val === "object" && !Array.isArray(val) && "actual" in val && "expected" in val) {
      fields.push({ label: key, actual: String(val.actual), expected: String(val.expected) });
    }
  }
  return fields;
}

export default NormalRoundTemplate;
