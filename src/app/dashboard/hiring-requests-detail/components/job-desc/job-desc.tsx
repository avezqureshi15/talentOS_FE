import type { JobDescriptionProps } from "./job-desc.types";
import "./job-desc.css";

const JobDescription = ({ hiringRequest }: JobDescriptionProps) => {
  return (
    <div className="bento-grid">
      <div className="bento-grid-left">
        <div className="bento-card">
          <h3>Role Overview</h3>
          <p>{hiringRequest.description}</p>
        </div>

        {(hiringRequest.requirements ?? []).length > 0 && (
          <div className="bento-card">
            <h3>Requirements</h3>
            <div className="jd-chip-list">
              {(hiringRequest.requirements ?? []).map((req, i) => (
                <span key={i} className="jd-chip">{req}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bento-grid-right">
        <div className="bento-card jd-details-card">
          <h3 className="jd-details-heading"><i className="bx bx-briefcase" /> Job Details</h3>
          <div className="jd-detail-row">
            <span className="jd-detail-icon"><i className="bx bx-building" /></span>
            <div className="jd-detail-body">
              <span className="jd-detail-label">Department</span>
              <span className="jd-detail-value">{hiringRequest.department}</span>
            </div>
          </div>
          <div className="jd-detail-row">
            <span className="jd-detail-icon"><i className="bx bx-location-pin" /></span>
            <div className="jd-detail-body">
              <span className="jd-detail-label">Location</span>
              <span className="jd-detail-value">{hiringRequest.location}</span>
            </div>
          </div>
          {(hiringRequest.benefits ?? []).length > 0 && (
            <div className="jd-detail-row">
              <span className="jd-detail-icon"><i className="bx bx-gift" /></span>
              <div className="jd-detail-body">
                <span className="jd-detail-label">Benefits</span>
                <div className="jd-chip-list">
                  {(hiringRequest.benefits ?? []).map((ben, i) => (
                    <span key={i} className="jd-chip">{ben}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="jd-detail-row">
            <span className="jd-detail-icon"><i className="bx bx-briefcase" /></span>
            <div className="jd-detail-body">
              <span className="jd-detail-label">Employment</span>
              <span className="jd-detail-value">{hiringRequest.type}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
