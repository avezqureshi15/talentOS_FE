import { truncateText } from "./applicants.utils";
import { APPLICANT_LABELS } from "@/constants/constants";
import MarkdownRenderer from "@/app/chat/components/chat-area/block-renderer/blocks/markdown/markdown";

type Props = {
  aiSummary: string;
  applicantId: string;
  onReadMore?: (id: string) => void;
  reviews?: Record<string, unknown>;
  showFull?: boolean;
};

const CardAiSummaryTab = ({ aiSummary, applicantId, onReadMore, showFull = false }: Props) => {
  const trimmed = aiSummary.trim();

  if (showFull) {
    return (
      <div className="cep-ai-summary">
        {trimmed ? (
          <MarkdownRenderer content={aiSummary} />
        ) : (
          <p className="cover-letter-text">{APPLICANT_LABELS.NO_AI_SUMMARY}</p>
        )}
      </div>
    );
  }

  const aiSum = trimmed ? truncateText(aiSummary, 50) : null;

  return (
    <div className="cover-letter">
      <div className="cover-letter-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" /></svg>
        {APPLICANT_LABELS.AI_SUMMARY}
      </div>
      {aiSum ? (
        <p className="cover-letter-text">
          {aiSum.text}
          {onReadMore && (
            <button className="read-more" onClick={(e) => { e.stopPropagation(); onReadMore(applicantId); }}>
              {APPLICANT_LABELS.READ_MORE}
            </button>
          )}
        </p>
      ) : (
        <p className="cover-letter-text">{APPLICANT_LABELS.NO_AI_SUMMARY}</p>
      )}
    </div>
  );
};

export default CardAiSummaryTab;
