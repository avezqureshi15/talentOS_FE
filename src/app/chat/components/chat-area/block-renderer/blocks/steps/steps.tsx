import React from "react";
import "./steps.css";

type Props = {
  title?: string;
  items: string[];
};

const StepsFeed: React.FC<Props> = ({ title = "Steps", items }) => {
  if (!items.length) return null;

  return (
    <div className="steps-feed">
      <div className="steps-feed-title">{title}</div>
      <div className="steps-feed-list">
        {items.map((s, idx) => (
          <div key={idx} className="steps-feed-item">
            {s}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepsFeed;

