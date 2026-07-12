import { truncateText } from "./applicants.utils";
import { APPLICANT_LABELS } from "@/constants/constants";
import MarkdownRenderer from "@/app/chat/components/chat-area/block-renderer/blocks/markdown/markdown";

type Props = {
  aiSummary: string;
  applicantId: string;
  onReadMore: (id: string) => void;
  reviews?: Record<string, unknown>;
};

const CardAiSummaryTab = ({ aiSummary, applicantId, onReadMore, reviews }: Props) => {
  const aiSum = aiSummary ? truncateText(aiSummary, 50) : null;
  const rejectedStatus = reviews?.rejected_status as string[] | undefined;
  const rejectedReason = reviews?.rejected_reason as string | undefined;
  const hasRejection = (rejectedStatus && rejectedStatus.length > 0) || !!rejectedReason;

  return (
    <div className="cover-letter">
      <div className="cover-letter-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" /></svg>
        {APPLICANT_LABELS.AI_SUMMARY}
      </div>
      {hasRejection && (
        <div className="rejection-section">
          {rejectedStatus && rejectedStatus.length > 0 && (
            <div className="rejection-chip-group">
              {rejectedStatus.map((s, i) => (
                <span key={i} className="rejection-chip">{s}</span>
              ))}
            </div>
          )}
          {rejectedReason && (
            <p className="rejection-text">{rejectedReason}</p>
          )}
        </div>
      )}
      {aiSum ? (
        <div className="cover-letter-text">
          <MarkdownRenderer content={aiSum.text} />
          {aiSum.truncated && (
            <button className="read-more" onClick={(e) => { e.stopPropagation(); onReadMore(applicantId); }}>
              {APPLICANT_LABELS.READ_MORE}
            </button>
          )}
        </div>
      ) : (
        <p className="cover-letter-text">{APPLICANT_LABELS.NO_AI_SUMMARY}</p>
      )}
    </div>
  );
};

export default CardAiSummaryTab;
