import { useEffect, useState, useCallback } from "react";
import "./timeline.css";
import AddRemarkModal from "@/app/dashboard/hiring-requests-detail/components/modal/add-remark-modal";
import { mockSteps as INITIAL_STEPS } from "@/app/dashboard/hiring-requests-detail/mock";
import { TIMELINE_LABELS } from "@/constants/constants";
import type { TimelineStep, TimelineSheetProps } from "./timeline.types";
import { useEscapeKey } from "./use-escape-key";

export default function ApplicantTimelineSheet({
  openId,
  onClose,
}: TimelineSheetProps) {
  // justification: controls whether the sheet DOM is mounted (deferred unmount for exit animation)
  const [render, setRender] = useState(!!openId);
  // justification: drives open/close CSS animation state
  const [anim, setAnim] = useState<"open" | "close">(
    openId ? "open" : "close"
  );
  // justification: tracks which timeline step node is expanded
  const [expanded, setExpanded] = useState<string | null>(null);
  // justification: controls the add-remark modal visibility
  const [remarkOpen, setRemarkOpen] = useState(false);
  // justification: tracks which step is receiving a new remark
  const [activeStep, setActiveStep] = useState<string | null>(null);
  // justification: stores remarks appended locally (mock steps are static)
  const [remarks, setRemarks] = useState<Record<string, string[]>>({});

  const steps: TimelineStep[] = INITIAL_STEPS.map((s) => ({
    ...s,
    remarks: s.remarks ? [...s.remarks, ...(remarks[s.id] ?? [])] : (remarks[s.id] ?? []),
  }));

  // Sync sheet open/close with render and animation state; lock body scroll when open
  useEffect(() => {
    if (openId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRender(true);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => setAnim("open"));
    } else {
      setAnim("close");
      document.body.style.overflow = "";
      const t = setTimeout(() => setRender(false), 220);
      return () => clearTimeout(t);
    }
  }, [openId]);

  // Close sheet on Escape key press
  useEscapeKey(onClose);

  const addRemark = useCallback((text: string) => {
    if (!activeStep) return;
    setRemarks((prev) => ({
      ...prev,
      [activeStep]: [...(prev[activeStep] ?? []), text],
    }));
  }, [activeStep]);

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
              <i className="bx bx-time-five"></i> {TIMELINE_LABELS.CANDIDATE_JOURNEY}
            </div>

            <button className="close-btn" onClick={onClose}>
              <i className="bx bx-x"></i>
            </button>
          </div>

          {/* TIMELINE */}
          <div className="timeline-container">
            <div className="timeline-line" />

            {steps.map((step) => {
              const isOpen = expanded === step.id;

              return (
                <div key={step.id} className="timeline-node">
                  {/* DOT */}
                  <div className={`dot ${step.status}`} />

                  {/* CONTENT */}
                  <div className="node-content">
                    <div
                      className="node-header"
                      onClick={() =>
                        setExpanded(isOpen ? null : step.id)
                      }
                    >
                      <div>
                        <div className="node-title">
                          {step.title}
                        </div>
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

                    {/* BODY */}
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
                            setActiveStep(step.id);
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

      {/* ADD REMARK MODAL */}
      <AddRemarkModal
        open={remarkOpen}
        onClose={() => setRemarkOpen(false)}
        onSave={(text) => addRemark(text)}
      />
    </>
  );
}