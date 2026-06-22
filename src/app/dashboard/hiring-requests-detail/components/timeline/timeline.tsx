import { useEffect, useState } from "react";
import "./timeline.css";
import AddRemarkModal from "@/app/dashboard/hiring-requests-detail/components/modal/add-remark-modal";
import { mockSteps } from "@/app/dashboard/hiring-requests-detail/mock";
import { TIMELINE_LABELS } from "@/constants/constants";

type TimelineStatus = "waiting" | "queued" | "success";

export type TimelineStep = {
  id: string;
  title: string;
  description: string;
  status: TimelineStatus;

  date?: string;
  actor?: string;
  remarks?: string[];
};

export default function ApplicantTimelineSheet({
  openId,
  onClose,
}: {
  openId: string | null;
  onClose: () => void;
}) {
  const [render, setRender] = useState(!!openId);
  const [anim, setAnim] = useState<"open" | "close">(
    openId ? "open" : "close"
  );

  const [expanded, setExpanded] = useState<string | null>(null);

  const [remarkOpen, setRemarkOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const [steps, setSteps] = useState<TimelineStep[]>(mockSteps);

  useEffect(() => {
    if (openId) {
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

  useEffect(() => {
    if (!openId) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [openId, onClose]);

  const addRemark = (text: string) => {
    if (!activeStep) return;

    setSteps((prev) =>
      prev.map((s) =>
        s.id === activeStep
          ? { ...s, remarks: [...(s.remarks || []), text] }
          : s
      )
    );
  };

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