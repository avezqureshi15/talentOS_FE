import type { HiringRequest } from "@/services/hiring-requests/hiring-requests.types";

const JobDescription = ({ hiringRequest }: { hiringRequest: HiringRequest }) => {
  return (
    <div className="bento-grid">
      <div className="bento-card large">
        <h3>Role Overview</h3>
        <p>{hiringRequest.description}</p>
      </div>

      <div className="bento-card">
        <h3>Department</h3>
        <p>{hiringRequest.department}</p>
      </div>

      <div className="bento-card">
        <h3>Location</h3>
        <p>{hiringRequest.location}</p>
      </div>

      {hiringRequest.benefits.length > 0 && (
        <div className="bento-card">
          <h3>Benefits</h3>
          <div className="chip-list">
            {hiringRequest.benefits.map((ben, i) => (
              <span key={i} className="chip">{ben}</span>
            ))}
          </div>
        </div>
      )}

      {hiringRequest.requirements.length > 0 && (
        <div className="bento-card">
          <h3>Requirements</h3>
          <div className="chip-list">
            {hiringRequest.requirements.map((req, i) => (
              <span key={i} className="chip">{req}</span>
            ))}
          </div>
        </div>
      )}

      <div className="bento-card">
        <h3>Employment</h3>
        <p>{hiringRequest.type}</p>
      </div>
    </div>
  );
};

export default JobDescription;
