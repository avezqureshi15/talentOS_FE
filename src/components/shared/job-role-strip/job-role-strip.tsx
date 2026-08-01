import { JOB_ROLE_STRIP_LABELS } from "./job-role-strip.constants";
import { useJobRoleStrip } from "./use-job-role-strip";
import type { JobRoleStripProps } from "./job-role-strip.types";
import "./job-role-strip.css";

const JobRoleStrip = ({ hiringRequestId }: JobRoleStripProps) => {
  const { text, icon, visible, dismiss } = useJobRoleStrip(hiringRequestId);

  if (!visible || !text) return null;

  return (
    <div className="job-role-strip" role="status">
      <i className={`bx ${icon} job-role-strip__icon`} />
      <span className="job-role-strip__text">{text}</span>
      <button
        type="button"
        className="job-role-strip__close"
        aria-label={JOB_ROLE_STRIP_LABELS.DISMISS_ARIA}
        onClick={dismiss}
      >
        <i className="bx bx-x" />
      </button>
    </div>
  );
};

export default JobRoleStrip;
