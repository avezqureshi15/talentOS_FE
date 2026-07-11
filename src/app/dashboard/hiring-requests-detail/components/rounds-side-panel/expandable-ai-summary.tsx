import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ExpandableAiSummaryProps } from "./rounds-side-panel.types";
import { AI_SUMMARY_MAX_LENGTH } from "./rounds-side-panel.constants";

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

export default ExpandableAiSummary;
