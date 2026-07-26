import type { CandidateHeaderProps } from "./candidate-header.types";

const CandidateHeader = ({ title, avatarLabel, meta, actions }: CandidateHeaderProps) => {
  if (!meta) return null;

  return (
    <div className="jobs-toolbar">
      <div className="jobs-candidate-left">
        {avatarLabel && <div className="jobs-avatar-ring">{avatarLabel}</div>}
        <div className="jobs-candidate-info">
          <div className="jobs-candidate-top-row">
            <span className="jobs-email-text">{title}</span>
            <span className={`jobs-status-chip jobs-status-chip--${meta[0]?.variant ?? "success"}`}>
              <span className="jobs-status-dot" />
              {meta[0]?.label}
            </span>
            <span className="jobs-job-title-text">{meta[1]?.label}</span>
          </div>
          <div className="jobs-candidate-bottom-row">
            <span>{meta[2]?.label}</span>
            {meta[3] && <span className="jobs-relative-tag">{meta[3].label}</span>}
          </div>
        </div>
      </div>
      <div className="jobs-toolbar-right">
        {actions?.map((action) => (
          <button key={action.key} className="jobs-glass-btn" onClick={action.onClick}>
            {action.icon && <i className={action.icon} />}
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CandidateHeader;
