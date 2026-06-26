import BaseModal from "@/components/ui/modal/base-modal";
import type { RoundsSidePanelProps, PanelContentProps, RowProps } from "./rounds-side-panel.types";
import { ROUNDS_PANEL_LABELS, ROUNDS_FALLBACK, VERDICT_LABELS, AI_LABELS, HR_LABELS } from "./rounds-side-panel.constants";
import "./rounds-side-panel.css";

const verdictIcon: Record<string, string> = {
  reject: "bx bx-x-circle",
  hold: "bx bx-timer",
  advance: "bx bx-check-double",
};

const aiIcon: Record<string, string> = {
  pending: "bx bx-hourglass",
  selected: "bx bx-check-circle",
  rejected: "bx bx-x-circle",
  conflict: "bx bx-error",
};

const hrIcon: Record<string, string> = {
  pending: "bx bx-hourglass",
  approved: "bx bx-check-double",
  rejected: "bx bx-x-circle",
};

const AI_LINE_RENDERERS = [
  { match: (l: string) => l.endsWith(":"), Component: ({ l, i }: { l: string; i: number }) => <span key={i} className="rp-ai-heading">{l}</span> },
  { match: (l: string) => l.startsWith("•"), Component: ({ l, i }: { l: string; i: number }) => <span key={i} className="rp-ai-bullet">{l}</span> },
  { match: () => true, Component: ({ l, i }: { l: string; i: number }) => <p key={i} className="rp-ai-text">{l}</p> },
];

const RoundsSidePanel = ({ open, round, onClose }: RoundsSidePanelProps) => {
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={ROUNDS_PANEL_LABELS.TITLE}
      variant="slide-right"
    >
      {round && <PanelContent round={round} />}
    </BaseModal>
  );
};

const PanelContent = ({ round }: PanelContentProps) => {
  if (!round) return null;

  const avg = round.ratings.length > 0
    ? (round.ratings.reduce((s, r) => s + r.score, 0) / round.ratings.length).toFixed(1)
    : null;

  return (
    <div className="rp-content">
      <span className="rp-badge">{round.round}</span>

      <div className="rp-divider" />

      <div className="rp-group">
        <span className="rp-group-title">Interview Info</span>
        <div className="rp-details">
          <Row label="Interviewer" icon="bx bx-user" value={round.interviewer} />
          <Row label="Hiring Role" icon="bx bx-briefcase" value={round.role} />
          <Row label="JD" icon="bx bx-file" value={round.jdLabel} />
          <Row label="With Whom" icon="bx bx-user-voice" value={round.candidate} />
        </div>
      </div>

      <div className="rp-divider" />

      <div className="rp-group">
        <span className="rp-group-title">Schedule Details</span>
        <div className="rp-details">
          <Row label="Occurred On" icon="bx bx-calendar" value={round.occurredOn} />
          <Row label="Slot" icon="bx bx-time" value={round.slot} />
          <Row label="Duration" icon="bx bx-stopwatch" value={round.duration} />
          <Row label="Interview Type" icon="bx bx-video" value={round.interviewType} />
          <Row label="Status" icon="bx bx-check-circle" value={round.status} />
        </div>
      </div>

      <div className="rp-divider" />

      <div className="rp-group">
        <span className="rp-group-title">Decisions</span>
        <div className="rp-decision-cards">
          <div className="rp-decision-card">
            <span className="rp-decision-label">Interviewer</span>
            <span className={`rp-pill rp-pill--${round.verdict}`}>
              <i className={verdictIcon[round.verdict]} />
              {VERDICT_LABELS[round.verdict]}
            </span>
          </div>
          <div className="rp-decision-card">
            <span className="rp-decision-label">AI Decision</span>
            <span className={`rp-pill rp-pill--ai-${round.aiDecision}`}>
              <i className={aiIcon[round.aiDecision]} />
              {AI_LABELS[round.aiDecision]}
            </span>
          </div>
          <div className="rp-decision-card">
            <span className="rp-decision-label">HR Decision</span>
            <span className={`rp-pill rp-pill--hr-${round.hrDecision}`}>
              <i className={hrIcon[round.hrDecision]} />
              {HR_LABELS[round.hrDecision]}
            </span>
          </div>
        </div>
      </div>

      <div className="rp-divider" />

      <div className="rp-group">
        <span className="rp-group-title">AI Summary</span>
        <div className="rp-ai-summary">
          {round.aiSummary.split("\n").map((line, i) => {
            const trimmed = line.trim();
            if (!trimmed) return null;
            const renderer = AI_LINE_RENDERERS.find((r) => r.match(trimmed));
            return renderer ? <renderer.Component l={trimmed} i={i} /> : null;
          })}
        </div>
      </div>

      <div className="rp-divider" />

      <div className="rp-group">
        <span className="rp-group-title">Ratings</span>
        <div className="rp-ratings">
          {round.ratings.map((r, i) => (
            <div key={i} className="rp-rating-row">
              <span className="rp-rating-label">{r.label}</span>
              <span className="rp-rating-score">{r.score}/{r.maxScore}</span>
            </div>
          ))}
        </div>
        {avg && <span className="rp-avg">Average: {avg}/4</span>}
      </div>

      {round.skills.length > 0 && (
        <>
          <div className="rp-divider" />
          <div className="rp-group">
            <span className="rp-group-title">Skills Verified</span>
            <div className="rp-skills">
              {round.skills.map((s, i) => (
                <span key={i} className="rp-skill-chip">{s}</span>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="rp-divider" />

      <div className="rp-group">
        <span className="rp-group-title">Review Notes</span>
        <p className="rp-notes">{round.notes || ROUNDS_FALLBACK.NO_NOTES}</p>
      </div>
    </div>
  );
};

const Row = ({ label, icon, value }: RowProps) => (
  <div className="rp-row">
    <span className="rp-row-label"><i className={icon} /> {label}</span>
    <span className="rp-row-value">{value}</span>
  </div>
);

export default RoundsSidePanel;
