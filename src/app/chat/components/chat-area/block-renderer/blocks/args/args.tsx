import React from "react";
import "./args.css";

type Props = {
  text: string;
  collapsed?: boolean;
};

const ArgsStream: React.FC<Props> = ({ text, collapsed = false }) => {
  if (!text.trim()) return null;

  // Keep it readable in the collapsed preview line.
  const preview = text.replace(/\s+/g, " ").trim();

  return (
    <details className="args-stream" open={!collapsed}>
      <summary className="args-stream-summary">
        <span className="args-stream-preview" title={preview}>
          {preview}
        </span>
      </summary>
      <pre className="args-stream-pre">{text}</pre>
    </details>
  );
};

export default ArgsStream;

