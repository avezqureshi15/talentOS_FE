import { useState } from "react";
import "./evaluation-topics.css";
import type { EvaluationTopicsProps } from "./evaluation-topics.types";

const STATUS_CLASS: Record<string, string> = {
  BELOW_BAR: "et-sub-status--below",
  MEETS_BAR: "et-sub-status--meets",
  ABOVE_BAR: "et-sub-status--above",
};

const STATUS_LABEL: Record<string, string> = {
  BELOW_BAR: "BELOW BAR",
  MEETS_BAR: "MEETS BAR",
  ABOVE_BAR: "ABOVE BAR",
};

const POINT_CLASS: Record<string, string> = {
  positive: "et-point--positive",
  negative: "et-point--negative",
  warning: "et-point--warning",
};

const POINT_ICON: Record<string, string> = {
  positive: "\u2713",
  negative: "\u2717",
  warning: "\u26A0",
};

const EvaluationTopics = ({ topics }: EvaluationTopicsProps) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(topics.map((t) => t.id)));

  const toggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="et-list">
      {topics.map((topic) => (
        <div key={topic.id} className="et-card">
          <div className="et-header" onClick={() => toggle(topic.id)}>
            <span className="et-header-left">{topic.title}</span>
            <div className="et-header-right">
              <button className="et-play-btn" onClick={(e) => { e.stopPropagation(); }}><i className="bx bx-play" /> Play</button>
              <span className="et-rating-badge">
                RATING: {topic.rating} / {topic.maxRating}
                <i className="bx bxs-info-circle et-rating-info" />
              </span>
            </div>
          </div>
          {expandedIds.has(topic.id) && (
            <div className="et-body">
              {topic.problemStatement && (
                <div className="et-problem-statement">
                  <span className="et-problem-text">Problem Statement shown to the Candidate</span>
                  <button className="et-problem-open">Open</button>
                </div>
              )}
              <ul className="et-bullets">
                {topic.summaryBullets.map((b, i) => (
                  <li key={i} className="et-bullet"><span className="et-bullet-marker">&bull;</span> {b}</li>
                ))}
              </ul>
              <div className="et-sub-grid">
                {topic.subCriteria.map((sc, i) => (
                  <div key={i} className="et-sub-card">
                    <div className="et-sub-header">
                      <span className="et-sub-title">{sc.title}</span>
                      <div className="et-sub-status-row">
                        <span className={`et-sub-status ${STATUS_CLASS[sc.status]}`}>{STATUS_LABEL[sc.status]}</span>
                        <i className="bx bxs-info-circle et-sub-info" />
                      </div>
                    </div>
                    <div className="et-points">
                      {sc.points.map((p, j) => (
                        <div key={j} className={`et-point ${POINT_CLASS[p.type]}`}>
                          <span className="et-point-icon">{POINT_ICON[p.type]}</span>
                          {p.text}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EvaluationTopics;
