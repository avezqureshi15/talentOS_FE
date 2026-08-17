import { useRef } from "react";
import { Sparkles, Info, Check, X } from "lucide-react";
import TranscriptPanel from "../transcript-panel/transcript-panel";
import RecordingPanel from "./recording-panel";
import TopicCard from "./topic-card";
import type { CandidateEvaluationData, QuestionScore } from "../../pages/round-details.types";
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

const TOPIC_ORDER: string[] = [
  "technical_fit",
  "communication",
  "experience",
  "problem_solving",
  "role_alignment",
];

type Props = {
  data: CandidateEvaluationData;
};

const RubricSection = ({ questionScores, rubricTotal }: { questionScores: QuestionScore[]; rubricTotal?: number | null }) => (
  <div className="rd-rubric-card">
    <div className="rd-topic-header">
      <h3 className="rd-topic-title">Question Rubric</h3>
      <span className="rd-rating-badge">
        {rubricTotal ? `${rubricTotal} pts total` : `${questionScores.length} questions`}
      </span>
    </div>
    <div className="rd-rubric-list">
      {questionScores.map((qs) => {
        const earned = typeof qs.earnedScore === "number" ? qs.earnedScore : qs.score;
        const max = typeof qs.score === "number" ? qs.score : earned;
        return (
          <div key={qs.id || qs.question} className="rd-rubric-item">
            <div className="rd-rubric-header">
              <span className="rd-rubric-question">{qs.question}</span>
              <span className="rd-rubric-score">
                {typeof earned === "number" ? earned : "—"}{typeof max === "number" ? `/${max}` : ""}
              </span>
            </div>
            {Array.isArray(qs.pointCoverage) && qs.pointCoverage.length > 0 && (
              <ul className="rd-rubric-coverage">
                {qs.pointCoverage.map((pc, i) => (
                  <li key={i} className={`rd-rubric-point ${pc.covered ? "rd-rubric-point--covered" : "rd-rubric-point--missed"}`}>
                    {pc.covered ? <Check className="rd-rubric-point-icon" /> : <X className="rd-rubric-point-icon" />}
                    <span>{pc.point}</span>
                  </li>
                ))}
              </ul>
            )}
            {qs.candidateAnswer && (
              <p className="rd-rubric-answer"><span className="rd-rubric-answer-label">Candidate: </span>{qs.candidateAnswer}</p>
            )}
            {qs.notes && <p className="rd-rubric-notes"><span className="rd-rubric-notes-label">Notes: </span>{qs.notes}</p>}
          </div>
        );
      })}
    </div>
  </div>
);

const AiInterviewTemplate = ({ data }: Props) => {
  const videoRef = useRef<CustomVideoHandle>(null);

  const handleSeek = (time: number) => {
    videoRef.current?.seek(time);
  };

  const hasStrengths = Array.isArray(data.strengths) && data.strengths.length > 0;
  const hasWeaknesses = Array.isArray(data.weaknesses) && data.weaknesses.length > 0;
  const hasRubric = Array.isArray(data.questionScores) && data.questionScores.length > 0;
  const sortedTopics = [...data.topics].sort((a, b) => {
    const ia = TOPIC_ORDER.indexOf(a.id);
    const ib = TOPIC_ORDER.indexOf(b.id);
    return (ia === -1 ? TOPIC_ORDER.length : ia) - (ib === -1 ? TOPIC_ORDER.length : ib);
  });

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

        {data.jdFit && (
          <div className="rd-topic-card">
            <div className="rd-topic-header">
              <h3 className="rd-topic-title">Job Description Fit</h3>
            </div>
            <p className="rd-jd-fit-text">{data.jdFit}</p>
          </div>
        )}

        {data.transcriptSummary && (
          <div className="rd-topic-card">
            <div className="rd-topic-header">
              <h3 className="rd-topic-title">Transcript Summary</h3>
            </div>
            <p className="rd-transcript-summary-text">{data.transcriptSummary}</p>
          </div>
        )}

        {(hasStrengths || hasWeaknesses) && (
          <div className="rd-topic-card">
            <div className="rd-topic-header">
              <h3 className="rd-topic-title">Strengths &amp; Weaknesses</h3>
            </div>
            {hasStrengths && (
              <div className="rd-chips-group">
                <span className="rd-chips-label rd-chips-label--positive">Strengths</span>
                <div className="rd-chips">
                  {data.strengths!.map((s, i) => <span key={i} className="rd-chip rd-chip--positive">{s}</span>)}
                </div>
              </div>
            )}
            {hasWeaknesses && (
              <div className="rd-chips-group">
                <span className="rd-chips-label rd-chips-label--negative">Weaknesses</span>
                <div className="rd-chips">
                  {data.weaknesses!.map((w, i) => <span key={i} className="rd-chip rd-chip--negative">{w}</span>)}
                </div>
              </div>
            )}
          </div>
        )}

        {hasRubric && <RubricSection questionScores={data.questionScores!} rubricTotal={data.rubricTotal} />}

        {sortedTopics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>

      <div className="rd-right">
        <div className="rd-video-wrapper">
          <RecordingPanel ref={videoRef} recordingUrl={data.recordingUrl} />
        </div>
        <div className="rd-transcript-area">
          <TranscriptPanel sections={data.transcriptSections} onSeek={handleSeek} collapsible={false} showSectionHeader={false} showBadge={false} />
        </div>
      </div>
    </div>
  );
};

export default AiInterviewTemplate;
