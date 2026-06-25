import "./timeline.css";

type Props = {
  steps: string[];
  currentStep: number;
};

const subLabels: Record<string, string> = {
  "Understanding role requirements": "Parsing job context and constraints",
  "Analyzing band level": "Matching seniority signals",
  "Defining responsibilities": "Scoping key outcomes and ownership",
  "Preparing job description": "Drafting structured JD content",
  "Finalizing output": "Polishing and formatting",
};

const Timeline: React.FC<Props> = ({ steps, currentStep }) => {
  const isDone = currentStep >= steps.length;

  return (
    <div className="tl-wrap">
      <div className="tl-header">
        {isDone
          ? <><i className="ti ti-check tl-done-icon" />done</>
          : <><span className="tl-header-dot" />working on it</>
        }
      </div>
      <div className="tl-steps">
        {steps.map((step, i) => {
          const state = i < currentStep ? "done" : i === currentStep ? "active" : "pending";
          const isLast = i === steps.length - 1;
          const connState = i < currentStep - 1 ? "filled" : i === currentStep - 1 ? "partial" : "empty";

          return (
            <div key={i} className="tl-step" data-state={state} style={{ '--tl-delay': `${i * 60}ms` }}>
              <div className="tl-left">
                <div className={`tl-node ${state}`}>
                  {state === "done"
                    ? <span className="tl-check">✓</span>
                    : <><div className="tl-node-ring" /><div className="tl-node-inner" /></>
                  }
                </div>
                {!isLast && (
                  <div className="tl-connector">
                    <div className={`tl-connector-fill ${connState}`} />
                  </div>
                )}
              </div>
              <div className="tl-content">
                <div className={`tl-label ${state}`}>
                  {state === "active"
                    ? <span className="tl-active-shimmer">{step}</span>
                    : step
                  }
                </div>
                {subLabels[step] && <div className="tl-sublabel">{subLabels[step]}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;