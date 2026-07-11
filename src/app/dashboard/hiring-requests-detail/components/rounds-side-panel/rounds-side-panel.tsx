import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BaseModal from "@/components/ui/modal/base-modal";
import PanelSkeleton from "./panel-skeleton";
import ReadMoreText from "./read-more-text";
import { useRoundDetail } from "./use-round-detail";
import type { RoundsSidePanelProps, PanelContentProps, RowProps, ExpandableAiSummaryProps } from "./rounds-side-panel.types";
import { ROUNDS_PANEL_LABELS, ROUNDS_PANEL_STATUS, ROUNDS_FALLBACK, VERDICT_LABELS, AI_LABELS, HR_LABELS, AI_SUMMARY_MAX_LENGTH } from "./rounds-side-panel.constants";
import "./rounds-side-panel.css";

const verdictIcon: Record<string, string> = {
  reject: "bx bx-x-circle",
  hold: "bx bx-clockr",
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

const RoundsSidePanel = ({ open, roundId, onClose }: RoundsSidePanelProps) => {
  const { data: round, isLoading, isError, refetch } = useRoundDetail(roundId);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={ROUNDS_PANEL_LABELS.TITLE}
      variant="slide-right"
    >
      {isLoading && <PanelSkeleton />}
      {isError && (
        <div className="rp-status rp-status--error">
          <p>{ROUNDS_PANEL_STATUS.ERROR}</p>
          <button className="action-link action-link-btn" onClick={() => refetch()} type="button">
            {ROUNDS_PANEL_STATUS.RETRY}
          </button>
        </div>
      )}
      {round && <PanelContent round={round} />}
    </BaseModal>
  );
};

const PanelContent = ({ round }: PanelContentProps) => {
  if (!round) return null;

  const interviewerRatings = round.ratings.filter((r) => r.entityType === "interviewer");
  const avg = interviewerRatings.length > 0
    ? (interviewerRatings.reduce((s, r) => s + r.score, 0) / interviewerRatings.length).toFixed(1)
    : null;
  const avgMax = interviewerRatings.length > 0 ? interviewerRatings[0].maxScore : 5;

  const hasBullets = round.strongMatches.length > 0 || round.gapsAndConcerns.length > 0;

  return (
    <div className="rp-content">
      {/* ── HEADER: Interview Info + Decisions ── */}
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
          <Row label="With Whom" icon="bx bx-user-voice" value={round.candidate} />
          <Row label="Occurred On" icon="bx bx-calendar" value={round.occurredOn} />
          <Row label="Slot" icon="bx bx-clock" value={round.slot} />
          <Row label="Duration" icon="bx bx-stopwatch" value={round.duration} />
          <Row label="Interview Type" icon="bx bx-video" value={round.interviewType} />
          <Row label="Status" icon="bx bx-check-circle" value={round.status} />
        </div>
      </div>

      {round.verdict || round.aiDecision || round.hrDecision ? (
        <>
          <div className="rp-divider" />
          <div className="rp-group">
            <span className="rp-group-title">Decisions</span>
            <div className="rp-decision-cards">
              {round.verdict && (
                <div className="rp-decision-card">
                  <span className="rp-decision-label">Interviewer</span>
                  <span className={`rp-pill rp-pill--${round.verdict}`}>
                    <i className={verdictIcon[round.verdict] ?? "bx bx-help-circle"} />
                    {VERDICT_LABELS[round.verdict] ?? round.verdict}
                  </span>
                </div>
              )}
              {round.aiDecision && (
                <div className="rp-decision-card">
                  <span className="rp-decision-label">AI Decision</span>
                  <span className={`rp-pill rp-pill--ai-${round.aiDecision}`}>
                    <i className={aiIcon[round.aiDecision] ?? "bx bx-help-circle"} />
                    {AI_LABELS[round.aiDecision] ?? round.aiDecision}
                  </span>
                </div>
              )}
              {round.hrDecision && (
                <div className="rp-decision-card">
                  <span className="rp-decision-label">HR Decision</span>
                  <span className={`rp-pill rp-pill--hr-${round.hrDecision}`}>
                    <i className={hrIcon[round.hrDecision] ?? "bx bx-help-circle"} />
                    {HR_LABELS[round.hrDecision] ?? round.hrDecision}
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}

      {/* ── BODY: AI Summary ── */}
      <div className="rp-divider" />

      <div className="rp-group">
        <span className="rp-group-title">AI Summary</span>
        <div className="rp-ai-summary md-content">
          {round.aiSummary ? (
            <ExpandableAiSummary text={round.aiSummary} />
          ) : hasBullets ? null : (
            <p className="rp-ai-empty">{ROUNDS_FALLBACK.NO_AI_SUMMARY}</p>
          )}
          {round.strongMatches.length > 0 && (
            <>
              <span className="rp-ai-subheading">Strong Matches</span>
              <ul>
                {round.strongMatches.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </>
          )}
          {round.gapsAndConcerns.length > 0 && (
            <>
              <span className="rp-ai-subheading">Gaps & Concerns</span>
              <ul>
                {round.gapsAndConcerns.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* ── FOOTER: Ratings + Skills + Notes ── */}
      <div className="rp-divider" />

      <div className="rp-group">
        <span className="rp-group-title">Ratings</span>
        <div className="rp-ratings">
          {round.ratings.map((r, i) => (
            <div key={i} className="rp-rating-row">
              <span className="rp-rating-label">{r.label === "fitscore" ? "ATS Score" : r.label}</span>
              <span className="rp-rating-score">{r.score}/{r.maxScore}</span>
            </div>
          ))}
        </div>
        {avg && <span className="rp-avg">Average: {avg}/{avgMax}</span>}
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

const ExpandableAiSummary = ({ text }: ExpandableAiSummaryProps) => {
  // justification: tracks expand/collapse toggle for AI summary text
  const [expanded, setExpanded] = useState(false);
  const needsTruncation = text.length > AI_SUMMARY_MAX_LENGTH;

  if (!needsTruncation) {
    return <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>;
  }

  return (
    <>
      {expanded ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      ) : (
        <div className="truncated-wrap truncated-wrap--fade rp-ai-text">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </div>
      )}
      <button className="show-more-btn" onClick={() => setExpanded((v) => !v)} type="button">
        {expanded ? <>Show less <i className="bx bx-chevron-up" /></> : <>Show more <i className="bx bx-chevron-down" /></>}
      </button>
    </>
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
