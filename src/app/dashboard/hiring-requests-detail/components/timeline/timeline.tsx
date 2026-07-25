import { useEffect, useState } from "react";
import "./timeline.css";
import { TIMELINE_LABELS } from "@/constants/constants";
import { TIMELINE_LABELS as LOCAL_LABELS } from "./timeline.constants";
import { useCandidateEvents } from "./hooks/use-candidate-events";
import type { TimelineStep, TimelineSheetProps } from "./timeline.types";
import { useEscapeKey } from "./use-escape-key";
import { formatMeetLinkLabel, isJoinMeetingAction } from "./timeline-action.helpers";

function StepAction({ step }: { step: TimelineStep }) {
  if (!step.actionUrl) return null;

  if (isJoinMeetingAction(step.actionLabel)) {
    return (
      <div className="meta-row">
        <span className="meta-label">
          <i className="bx bx-video" aria-hidden /> {TIMELINE_LABELS.MEET_LINK}
        </span>
        <a
          className="meta-value meta-value--link"
          href={step.actionUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {formatMeetLinkLabel(step.actionUrl)}
        </a>
      </div>
    );
  }

  return (
    <div className="node-actions">
      <a
        className="action-btn"
        href={step.actionUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="bx bx-link-external" aria-hidden />
        {step.actionLabel ?? "View"}
      </a>
    </div>
  );
}

export default function ApplicantTimelineSheet({
  openId,
  onClose,
}: TimelineSheetProps) {
  const [render, setRender] = useState(!!openId);
  const [anim, setAnim] = useState<"open" | "close">(
    openId ? "open" : "close",
  );
  const [expanded, setExpanded] = useState<string | null>(null);

  const { steps, loading, error, refetch } = useCandidateEvents(openId);

  useEffect(() => {
    if (openId) {
      setRender(true);
      setExpanded(null);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => setAnim("open"));
      return;
    }
    setAnim("close");
    document.body.style.overflow = "";
    const t = setTimeout(() => setRender(false), 220);
    return () => clearTimeout(t);
  }, [openId]);

  useEscapeKey(onClose);

  if (!render) return null;

  const showTrack = loading || (!error && steps.length > 0);

  return (
    <>
      <div className={`timeline-overlay ${anim}`} onClick={onClose}>
        <div
          className={`timeline-sheet ${anim}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="timeline-header">
            <div className="title">
              <i className="bx bx-history" aria-hidden />{" "}
              {TIMELINE_LABELS.CANDIDATE_JOURNEY}
            </div>
            <button type="button" className="close-btn" onClick={onClose} aria-label="Close">
              <i className="bx bx-x" aria-hidden />
            </button>
          </div>

          <div className="timeline-container">
            {!loading && error && (
              <div className="timeline-empty">
                <p>{LOCAL_LABELS.ERROR_LOADING}</p>
                <button type="button" className="ghost-btn" onClick={refetch}>
                  {LOCAL_LABELS.RETRY}
                </button>
              </div>
            )}

            {!loading && !error && steps.length === 0 && (
              <div className="timeline-empty">
                <p>{LOCAL_LABELS.NO_EVENTS}</p>
              </div>
            )}

            {showTrack && (
              <div className="timeline-track">
                <div className="timeline-line" aria-hidden />

                {loading && (
                  <div className="timeline-loading">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="timeline-node">
                        <div className="dot skeleton" />
                        <div className="node-content">
                          <div className="node-header skeleton" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!loading &&
                  !error &&
                  steps.map((step: TimelineStep, idx: number) => {
                    const isOpen = expanded === step.id;
                    return (
                      <div
                        key={step.id}
                        className={`timeline-node${isOpen ? " timeline-node--open" : ""}`}
                        style={{ "--idx": idx } as React.CSSProperties}
                      >
                        <div className={`dot ${step.status}`} />
                        <div className="node-content">
                          <div
                            className="node-header"
                            onClick={() => setExpanded(isOpen ? null : step.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setExpanded(isOpen ? null : step.id);
                              }
                            }}
                          >
                            <div>
                              <div className="node-title">{step.title}</div>
                              {step.description && (
                                <div className="node-sub">{step.description}</div>
                              )}
                              <div className="node-time">{step.date}</div>
                            </div>
                            <div className={`chev ${isOpen ? "open" : ""}`}>
                              <i className="bx bx-chevron-down" aria-hidden />
                            </div>
                          </div>

                          <div className={`node-body-wrap ${isOpen ? "open" : ""}`}>
                            <div className="node-body">
                              <div className="meta-row">
                                <span className="meta-label">
                                  <i className="bx bx-calendar" aria-hidden /> Date
                                </span>
                                <span className="meta-value">{step.date}</span>
                              </div>

                              {step.actor && (
                                <div className="meta-row">
                                  <span className="meta-label">
                                    <i className="bx bx-user" aria-hidden /> Action taken by
                                  </span>
                                  <span className="meta-value">{step.actor}</span>
                                </div>
                              )}

                              <StepAction step={step} />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
