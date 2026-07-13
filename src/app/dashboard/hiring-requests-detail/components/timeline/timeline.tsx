import { useEffect, useState, useCallback } from "react";
import "./timeline.css";
import AddRemarkModal from "@/app/dashboard/hiring-requests-detail/components/modal/add-remark-modal";
import { TIMELINE_LABELS } from "@/constants/constants";
import { TIMELINE_LABELS as LOCAL_LABELS } from "./timeline.constants";
import { useCandidateEvents } from "./hooks/use-candidate-events";
import type { TimelineStep, TimelineSheetProps } from "./timeline.types";
import { useEscapeKey } from "./use-escape-key";

export default function ApplicantTimelineSheet({
  openId,
  onClose,
}: TimelineSheetProps) {
  // UI state: controls sheet mount/unmount for open/close animation
  const [render, setRender] = useState(!!openId);
  const [anim, setAnim] = useState<"open" | "close">(
    openId ? "open" : "close",
  );
  // UI state: tracks which step's body is expanded
  const [expanded, setExpanded] = useState<string | null>(null);
  // UI state: remark modal visibility
  const [remarkOpen, setRemarkOpen] = useState(false);

  const { steps, loading, error } = useCandidateEvents(openId);

  // Side effect: animate sheet open/close + lock body scroll while open
  useEffect(() => {
    if (openId) {
      setRender(true);
      setExpanded(null);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => setAnim("open"));
    } else {
      setAnim("close");
      document.body.style.overflow = "";
      const t = setTimeout(() => setRender(false), 220);
      return () => clearTimeout(t);
    }
  }, [openId]);

  const handleRetry = useCallback(() => window.location.reload(), []);

  useEscapeKey(onClose);

  if (!render) return null;

  return (
    <>
      <div className={`timeline-overlay ${anim}`} onClick={onClose}>
        <div
          className={`timeline-sheet ${anim}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="timeline-header">
            <div className="title">
              <i className="bx bx-clock"></i>{" "}
              {TIMELINE_LABELS.CANDIDATE_JOURNEY}
            </div>
            <button className="close-btn" onClick={onClose}>
              <i className="bx bx-x"></i>
            </button>
          </div>

          {/* TIMELINE */}
          <div className="timeline-container">
            <div className="timeline-line" />

            {/* LOADING */}
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

            {/* ERROR */}
            {!loading && error && (
              <div className="timeline-empty">
                <p>{LOCAL_LABELS.ERROR_LOADING}</p>
                <button className="ghost-btn" onClick={handleRetry}>
                  {LOCAL_LABELS.RETRY}
                </button>
              </div>
            )}

            {/* EMPTY */}
            {!loading && !error && steps.length === 0 && (
              <div className="timeline-empty">
                <p>{LOCAL_LABELS.NO_EVENTS}</p>
              </div>
            )}

            {/* STEPS */}
            {!loading &&
              !error &&
              steps.map((step: TimelineStep) => {
                const isOpen = expanded === step.id;
                return (
                  <div key={step.id} className="timeline-node">
                    <div className={`dot ${step.status}`} />
                    <div className="node-content">
                      <div
                        className="node-header"
                        onClick={() =>
                          setExpanded(isOpen ? null : step.id)
                        }
                      >
                        <div>
                          <div className="node-title">{step.title}</div>
                          <div className="node-sub">
                            {step.description}
                          </div>
                        </div>
                        <div className="chev">
                          <i
                            className={`bx ${
                              isOpen
                                ? "bx-chevron-up"
                                : "bx-chevron-down"
                            }`}
                          />
                        </div>
                      </div>

                      {isOpen && (
                        <div className="node-body">
                          <div className="meta-row">
                            <i className="bx bx-calendar"></i>
                            <span>{step.date}</span>
                          </div>

                          {step.actor && (
                            <div className="meta-row">
                              <i className="bx bx-user"></i>
                              <span>{step.actor}</span>
                            </div>
                          )}

                          <div className="meta-row">
                            <i className="bx bx-info-circle"></i>
                            <span>Status:</span>
                            <b>{step.status}</b>
                          </div>

                          <button className="ghost-btn">
                            <i className="bx bx-download"></i>
                            {TIMELINE_LABELS.DOWNLOAD_RESUME}
                          </button>

                          <button
                            className="ghost-btn"
                            onClick={() => {
                              setRemarkOpen(true);
                            }}
                          >
                            <i className="bx bx-note"></i>
                            {TIMELINE_LABELS.ADD_REMARK}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <AddRemarkModal
        open={remarkOpen}
        onClose={() => setRemarkOpen(false)}
        onSave={() => {}}
      />
    </>
  );
}
