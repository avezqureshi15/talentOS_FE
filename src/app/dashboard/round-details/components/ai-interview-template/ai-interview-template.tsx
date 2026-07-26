import { useRef } from "react";
import { Sparkles, Play, Info, Check, X, AlertTriangle, FileCode, ShieldAlert } from "lucide-react";
import Chip from "@/components/ui/chip/chip";
import TranscriptPanel from "../transcript-panel/transcript-panel";
import CustomVideo from "@/components/shared/custom-video/custom-video";
import type { CandidateEvaluationData } from "../../pages/round-details.types";
import type { CustomVideoHandle } from "@/components/shared/custom-video/custom-video.types";
import "./ai-interview-template.css";

const RING_CLASS: Record<string, string> = {
  REJECT: "rd-stamp--reject",
  ADVANCE: "rd-stamp--advance",
  POTENTIAL_FIT: "rd-stamp--potential",
};

const PILL_CLASS: Record<string, string> = {
  REJECT: "rd-ai-pill--reject",
  ADVANCE: "rd-ai-pill--advance",
  POTENTIAL_FIT: "rd-ai-pill--potential",
};

const STATUS_VARIANT: Record<string, "danger" | "success" | "info"> = {
  BELOW_BAR: "danger",
  MEETS_BAR: "success",
  ABOVE_BAR: "info",
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

type Props = {
  data: CandidateEvaluationData;
};

const AiInterviewTemplate = ({ data }: Props) => {
  const videoRef = useRef<CustomVideoHandle>(null);
  const handleSeek = (time: number) => {
    videoRef.current?.seek(time);
  };
  return (
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
            <div className={`rd-stamp ${RING_CLASS[data.aiRecommendation]}`}>
              <svg className="rd-stamp-svg" viewBox="0 0 128 128">
                <defs>
                  <path id="stampArc" d="M 18,64 A 46,46 0 0,1 110,64" />
                  <path id="stampArcBottom" d="M 22,68 A 42,42 0 0,0 106,68" />
                </defs>
                <circle className="rd-stamp-ring rd-stamp-ring--outer" cx="64" cy="64" r="59" />
                <circle className="rd-stamp-ring rd-stamp-ring--mid" cx="64" cy="64" r="54" />
                <circle className="rd-stamp-ring rd-stamp-ring--inner" cx="64" cy="64" r="49" />
                <text className="rd-stamp-arc"><textPath href="#stampArc" startOffset="50%" textAnchor="middle">CERTIFIED</textPath></text>
                <text className="rd-stamp-arc rd-stamp-arc--bottom"><textPath href="#stampArcBottom" startOffset="50%" textAnchor="middle">EVALUATION</textPath></text>
              </svg>
              <span className="rd-stamp-value">{data.overallScore}</span>
              <span className="rd-stamp-label">SCORE</span>
              <span className="rd-stamp-denom">/ 5.0</span>
              <div className="rd-stamp-shine" />
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
                        <Chip variant={STATUS_VARIANT[sc.status]} size="sm">{STATUS_LABEL[sc.status]}</Chip>
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
        <div className="rd-video-wrapper">
          <CustomVideo ref={videoRef} src="/videos/video.mp4" />
        </div>
        <div className="rd-transcript-area">
          <TranscriptPanel sections={data.transcriptSections} onSeek={handleSeek} />
        </div>
      </div>
    </div>
  );
};

export default AiInterviewTemplate;
