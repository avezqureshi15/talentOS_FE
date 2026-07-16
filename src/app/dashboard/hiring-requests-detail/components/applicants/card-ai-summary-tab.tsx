import { truncateText } from "./applicants.utils";
import { APPLICANT_LABELS } from "@/constants/constants";

type RejectionDetailItem = Record<string, { JD: string; Candidate: string }>;

type Props = {
  aiSummary: string;
  applicantId: string;
  onReadMore: (id: string) => void;
  reviews?: Record<string, unknown>;
};

const CRITERION_LABELS: Record<string, string> = {
  YOE: "YOE",
  BUDGET: "Budget",
  LOCATION: "Location",
  NOTICE_PERIOD: "Notice Period",
};

const CardAiSummaryTab = ({ aiSummary, applicantId, onReadMore, reviews }: Props) => {
  const aiSum = aiSummary ? truncateText(aiSummary, 50) : null;
  const rejectionDetails = reviews?.rejection_details as RejectionDetailItem[] | undefined;
  const hasRejection = !!rejectionDetails && rejectionDetails.length > 0;

  return (
    <div className="cover-letter">
      <div className="cover-letter-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" /></svg>
        {APPLICANT_LABELS.AI_SUMMARY}
      </div>
      {hasRejection && (
        <div className="rejection-section">
          {rejectionDetails!.map((item, i) => {
            const key = Object.keys(item)[0];
            return <span key={i} className="rejection-chip">{CRITERION_LABELS[key] ?? key}</span>;
          })}
        </div>
      )}
      {aiSum ? (
        <p className="cover-letter-text">
          {aiSum.text}
          <button className="read-more" onClick={(e) => { e.stopPropagation(); onReadMore(applicantId); }}>
            {APPLICANT_LABELS.READ_MORE}
          </button>
        </p>
      ) : (
        <p className="cover-letter-text">{APPLICANT_LABELS.NO_AI_SUMMARY}</p>
      )}
    </div>
  );
};

export default CardAiSummaryTab;
