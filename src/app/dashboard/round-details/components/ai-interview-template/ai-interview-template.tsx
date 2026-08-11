import { useRef } from "react";
import { Sparkles, Info } from "lucide-react";
import TranscriptPanel from "../transcript-panel/transcript-panel";
import RecordingPanel from "./recording-panel";
import TopicCard from "./topic-card";
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
