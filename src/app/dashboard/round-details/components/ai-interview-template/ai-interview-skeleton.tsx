import Skeleton from "@/components/ui/skeleton/skeleton";
import "./ai-interview-skeleton.css";

const TOPIC_COUNT = 3;
const TRANSCRIPT_LINES = 6;

const AiInterviewSkeleton = () => (
  <div className="aiks-root" aria-hidden="true">
    <div className="aiks-left">
      <div className="aiks-hero-card">
        <div className="aiks-hero-body">
          <div className="aiks-hero-top">
            <Skeleton variant="rect" width="92px" height="12px" borderRadius="2px" />
            <Skeleton variant="rect" width="84px" height="20px" borderRadius="2px" />
          </div>
          <Skeleton variant="text" width="120px" height="14px" />
          <Skeleton variant="rect" width="100%" height="48px" borderRadius="4px" />
          <Skeleton variant="text" width="180px" height="12px" />
        </div>
        <div className="aiks-hero-score-col">
          <Skeleton variant="circle" width="112px" height="112px" className="aiks-stamp" />
          <Skeleton variant="rect" width="42px" height="10px" borderRadius="2px" />
        </div>
      </div>

      {Array.from({ length: TOPIC_COUNT }).map((_, i) => (
        <div className="aiks-topic-card" key={i}>
          <div className="aiks-topic-header">
            <Skeleton variant="text" width="40%" height="12px" />
            <div className="aiks-topic-header-actions">
              <Skeleton variant="rect" width="74px" height="24px" borderRadius="2px" />
              <Skeleton variant="rect" width="54px" height="24px" borderRadius="2px" />
            </div>
          </div>
          <div className="aiks-topic-body">
            <Skeleton variant="rect" width="100%" height="10px" borderRadius="2px" />
            <Skeleton variant="rect" width="92%" height="10px" borderRadius="2px" />
            <Skeleton variant="rect" width="70%" height="10px" borderRadius="2px" />
          </div>
          <div className="aiks-topic-footer">
            <Skeleton variant="rect" width="46%" height="9px" borderRadius="2px" />
            <Skeleton variant="rect" width="30%" height="9px" borderRadius="2px" />
          </div>
        </div>
      ))}
    </div>

    <div className="aiks-right">
      <div className="aiks-video">
        <Skeleton variant="rect" width="100%" borderRadius="12px" className="aiks-video-bg" />
      </div>
      <div className="aiks-transcript">
        <div className="aiks-transcript-header">
          <Skeleton variant="rect" width="120px" height="12px" borderRadius="2px" />
        </div>
        {Array.from({ length: TRANSCRIPT_LINES }).map((_, i) => (
          <div className="aiks-utterance" key={i}>
            <Skeleton variant="text" width="22%" height="12px" className="aiks-utterance-speaker" />
            <div className="aiks-utterance-text">
              <Skeleton variant="text" width="100%" height="12px" />
              <Skeleton variant="text" width="76%" height="12px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AiInterviewSkeleton;