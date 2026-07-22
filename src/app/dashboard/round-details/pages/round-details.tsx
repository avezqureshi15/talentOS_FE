import { useParams, useNavigate } from "react-router-dom";
import "./round-details.css";
import type { RoundDetailsParams } from "./round-details.types";

const RoundDetails = () => {
  const { id, candidateId } = useParams<RoundDetailsParams>();
  const navigate = useNavigate();

  return (
    <div className="rd-page">
      <button className="rd-back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h1 className="rd-title">Round Details</h1>
      <p className="rd-subtitle">
        Hiring Request: {id} | Candidate: {candidateId}
      </p>
    </div>
  );
};

export default RoundDetails;