import "./round-details.css";
import { MOCK_EVALUATION } from "./round-details.constants";
import { Sparkles, FileText, Share2, Play, Info, Check, X, AlertTriangle, FileCode, ShieldAlert } from "lucide-react";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import TranscriptPanel from "../components/transcript-panel/transcript-panel";

const getInitials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const RING_CLASS: Record<string, string> = {
  REJECT: "rd-score-ring--reject",
  ADVANCE: "rd-score-ring--advance",
  POTENTIAL_FIT: "rd-score-ring--potential",
};

const PILL_CLASS: Record<string, string> = {
  REJECT: "rd-ai-pill--reject",
  ADVANCE: "rd-ai-pill--advance",
  POTENTIAL_FIT: "rd-ai-pill--potential",
};

const STATUS_CLASS: Record<string, string> = {
  BELOW_BAR: "rd-status--below",
  MEETS_BAR: "rd-status--meets",
  ABOVE_BAR: "rd-status--above",
};

const STATUS_LABEL: Record<string, string> = {
  BELOW_BAR: "BELOW BAR",
  MEETS_BAR: "MEETS BAR",
  ABOVE_BAR: "ABOVE BAR",
};

const EVIDENCE_ICON: Record<string, typeof X> = {
  positive: Check,
  negative: X,
  warning: AlertTriangle,
};

const EVIDENCE_COLOR: Record<string, string> = {
  positive: "rd-evidence--positive",
  negative: "rd-evidence--negative",
  warning: "rd-evidence--warning",
};

const RoundDetails = () => {
  const data = MOCK_EVALUATION;

  return (
    <div className="rd-root">
      <PageHeader />

      <header className="rd-topbar">
        <div className="rd-topbar-left">
          <div className="rd-avatar">{getInitials(data.candidateName)}</div>
          <div className="rd-topbar-meta">
            <span className="rd-topbar-email">{data.email}</span>
            <span className={`rd-topbar-status rd-topbar-status--${data.status.toLowerCase()}`}>{data.status}</span>
            <span className="rd-topbar-divider" />
            <span className="rd-topbar-job">{data.jobTitle}</span>
            <span className="rd-topbar-date">21 Jul, 15:57 IST (1d ago)</span>
          </div>
        </div>
        <div className="rd-topbar-right">
          <button className="rd-topbar-btn"><FileText className="rd-btn-icon" /><span>Resume</span></button>
          <button className="rd-topbar-btn"><Share2 className="rd-btn-icon" /><span>Share</span></button>
        </div>
      </header>

      <div className="rd-split">
        <div className="rd-left">
          <div className="rd-hero-card">
            <div className="rd-hero-body">
              <div className="rd-hero-top">
                <span className="rd-ai-label"><Sparkles className="rd-ai-sparkle" />AI SUGGESTS</span>
                <span className={`rd-ai-pill ${PILL_CLASS[data.aiRecommendation]}`}>
                  {data.aiRecommendation === "POTENTIAL_FIT" ? "POTENTIAL FIT" : data.aiRecommendation}
                </span>
              </div>
              <h2 className="rd-hero-assessment">Assessment</h2>
              <blockquote className="rd-hero-quote">&ldquo;{data.aiSummary}&rdquo;</blockquote>
              <p className="rd-hero-criteria">Criteria Met: {data.criteriaMet} of {data.totalCriteria}</p>
            </div>
            <div className="rd-hero-score-col">
              <div className={`rd-score-ring ${RING_CLASS[data.aiRecommendation]}`}>
                <span className="rd-score-value">{data.overallScore}</span>
                <span className="rd-score-denom">/ 5.0</span>
              </div>
              <Info className="rd-score-info" />
            </div>
          </div>

          {data.topics.map((topic) => (
            <div key={topic.id} className="rd-topic-card">
              <div className="rd-topic-header">
                <h3 className="rd-topic-title">{topic.title}</h3>
                <div className="rd-topic-actions">
                  <button className="rd-play-btn"><Play className="rd-play-icon" /> Play</button>
                  <span className="rd-rating-badge">
                    RATING: {topic.rating} / {topic.maxRating}
                    <Info className="rd-rating-info" />
                  </span>
                </div>
              </div>

              {topic.problemStatement && (
                <div className="rd-problem-bar">
                  <FileCode className="rd-problem-icon" />
                  <span className="rd-problem-text">Problem Statement shown to the Candidate</span>
                  <button className="rd-problem-open">Open</button>
                </div>
              )}

              <ul className="rd-bullets">
                {topic.summaryBullets.map((b, i) => (
                  <li key={i} className="rd-bullet"><span className="rd-bullet-dot">&bull;</span> {b}</li>
                ))}
              </ul>

              <div className="rd-sub-grid">
                {topic.subCriteria.map((sc, j) => {
                  return (
                    <div key={j} className="rd-sub-card">
                      <div className="rd-sub-header">
                        <span className="rd-sub-title">{sc.title}</span>
                        <div className="rd-sub-status-row">
                          <span className={`rd-sub-status ${STATUS_CLASS[sc.status]}`}>{STATUS_LABEL[sc.status]}</span>
                          <Info className="rd-sub-info" />
                        </div>
                      </div>
                      <div className="rd-evidence-list">
                        {sc.points.map((p, k) => {
                          const PIcon = EVIDENCE_ICON[p.type];
                          return (
                            <div key={k} className={`rd-evidence ${EVIDENCE_COLOR[p.type]}`}>
                              <PIcon className="rd-evidence-icon" />
                              <span>{p.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="rd-proctoring-card">
            <ShieldAlert className="rd-proctoring-icon" />
            <div className="rd-proctoring-body">
              <h4 className="rd-proctoring-title">PROCTORING FLAGS</h4>
              <p className="rd-proctoring-text">No proctoring flags surfaced during analysis. We still recommend reviewing the recording yourself before finalizing your decision.</p>
            </div>
          </div>
        </div>

        <div className="rd-right">
          <div className="rd-video-area">
            <Play className="rd-video-play" />
          </div>
          <div className="rd-transcript-area">
            <TranscriptPanel sections={data.transcriptSections} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundDetails;
