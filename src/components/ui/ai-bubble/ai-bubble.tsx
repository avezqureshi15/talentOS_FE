import "./ai-bubble.css";
import type { AiBubbleProps } from "./ai-bubble.types";

const SIZE_MAP = { sm: 18, md: 26, lg: 36 };

const AiBubble = ({ size = "md", active = true, pulse = true, label, className = "" }: AiBubbleProps) => {
  const iconSize = SIZE_MAP[size];

  const classes = [
    "ai-bubble",
    `ai-bubble--${size}`,
    active ? "ai-bubble--active" : "",
    pulse ? "ai-bubble--pulse" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`ai-bubble-wrap ${className}`}>
      <div className={classes}>
        <div className="ai-bubble-surface">
          <div className="ai-bubble-highlight" />
          <div className="ai-bubble-content">
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 0 1 10 10c0 2.5-1 4.8-2.6 6.5l1.5 2.5h-4.5A10 10 0 1 1 12 2z" />
              <path d="M9 10h6" />
              <path d="M9 14h4" />
            </svg>
          </div>
        </div>
      </div>
      {label && <span className="ai-bubble-label">{label}</span>}
    </div>
  );
};

export default AiBubble;
