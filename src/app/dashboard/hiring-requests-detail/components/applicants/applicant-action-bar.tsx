import { APPLICANT_LABELS } from "@/constants/constants";

type ApplicantActionBarProps = {
  phone?: string;
  linkedinUrl: string;
  cvUrl: string;
  onTimeline: () => void;
};

const ApplicantActionBar = ({ phone, linkedinUrl, cvUrl, onTimeline }: ApplicantActionBarProps) => (
  <div className="action-links">
    {phone && (
      <a href={`tel:${phone}`} className="action-link action-link--chip">
        <i className="bx bx-phone" aria-hidden />
        {phone}
      </a>
    )}
    <a
      href={linkedinUrl}
      target="_blank"
      rel="noreferrer"
      className="action-link action-link--chip"
    >
      <i className="bx bx-link-alt" aria-hidden />
      {APPLICANT_LABELS.LINKEDIN}
    </a>
    <a
      href={cvUrl}
      target="_blank"
      rel="noreferrer"
      className="action-link action-link--chip"
    >
      <i className="bx bx-file" aria-hidden />
      {APPLICANT_LABELS.VIEW_RESUME}
    </a>
    <button
      type="button"
      className="action-link action-link--chip action-link-btn"
      onClick={(e) => {
        e.stopPropagation();
        onTimeline();
      }}
    >
      <i className="bx bx-clock" aria-hidden />
      {APPLICANT_LABELS.TIMELINE}
    </button>
  </div>
);

export default ApplicantActionBar;
