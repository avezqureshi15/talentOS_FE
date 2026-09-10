import { Play, Info, Check, X, AlertTriangle, FileCode } from "lucide-react";
import Chip from "@/components/ui/chip/chip";
import type { EvaluationTopic } from "../../pages/round-details.types";

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

const TopicCard = ({ topic }: { topic: EvaluationTopic }) => (
  <div className="rd-topic-card">
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
      {topic.subCriteria.map((sc, j) => (
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
      ))}
    </div>
  </div>
);

export default TopicCard;
