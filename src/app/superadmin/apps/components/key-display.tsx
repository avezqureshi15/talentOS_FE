import { useState } from "react";
import type { KeyDisplayProps } from "./key-display.types";

export default function KeyDisplay({ fullKey }: KeyDisplayProps) {
  const [copiedOnce, setCopiedOnce] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullKey);
      setCopiedOnce(true);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <div className="kd-root">
      <div className="kd-header">
        <span className="kd-icon-k">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </span>
        <div>
          <h3 className="kd-title">New Key Generated</h3>
          <p className="kd-subtitle">Store this secret key securely. You won't be able to view it again.</p>
        </div>
      </div>

      <div className="kd-key-box">
        <code className="kd-key-text">{fullKey}</code>
        {copiedOnce ? (
          <span className="kd-copy-done">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Copied
          </span>
        ) : (
          <button className="kd-copy-btn" onClick={handleCopy}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
            Copy
          </button>
        )}
      </div>

      <div className="kd-warning">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>This key will not be shown again once you close this window.</span>
      </div>
    </div>
  );
}
