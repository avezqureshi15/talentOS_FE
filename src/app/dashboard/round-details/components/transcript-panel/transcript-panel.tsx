import { useState } from "react";
import { ChevronDown } from "lucide-react";
import "./transcript-panel.css";
import type { TranscriptPanelProps } from "./transcript-panel.types";

const SPEAKER_CLASS: Record<string, string> = {
  INTERVIEWER: "tp-speaker--interviewer",
  CANDIDATE: "tp-speaker--candidate",
  AI: "tp-speaker--ai",
};

const TranscriptPanel = ({ sections, onSeek, collapsible = true, showSectionHeader = true, showBadge = true }: TranscriptPanelProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => Object.fromEntries(sections.map((s) => [s.id, true]))
  );

  const toggle = (id: string) => {
    if (!collapsible) return;
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="tp-card">
      <div className="tp-header">
        <span>Transcript</span>
        {showBadge && <span className="tp-badge">{sections.length} sections</span>}
      </div>
      {sections.map((sec) => (
        <div key={sec.id} className="tp-section">
          {showSectionHeader && (
            <div className="tp-section-header" onClick={() => toggle(sec.id)}>
              {collapsible && (
                <ChevronDown className={`tp-chevron ${openSections[sec.id] ? "tp-chevron--open" : ""}`} />
              )}
              <span>{sec.title}</span>
            </div>
          )}
          {(!collapsible || openSections[sec.id]) && (
            <div>
              {sec.utterances.map((u) => (
                <div key={u.id} className="tp-utterance">
                  <span className={`tp-speaker-tag ${SPEAKER_CLASS[u.speaker]}`}>{u.speaker}</span>
                  {u.timestamp && u.timeInSeconds !== undefined && (
                    <span
                      className="tp-timestamp"
                      onClick={() => onSeek?.(u.timeInSeconds as number)}
                    >
                      {u.timestamp}
                    </span>
                  )}
                  <span className="tp-text">{u.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TranscriptPanel;
