import { truncateText } from "./applicants.utils";
import { APPLICANT_LABELS } from "@/constants/constants";
import type { CardVariant } from "./applicants.types";

type Props = {
  coverLetter: string;
  applicantId: string;
  onReadMore: (id: string) => void;
  variant?: CardVariant;
};

const CardCoverLetterTab = ({ coverLetter, applicantId, onReadMore, variant = "inline" }: Props) => {
  const trimmed = coverLetter.trim();

  if (variant === "panel") {
    if (!trimmed) {
      return (
        <div className="cep-empty">
          <div className="cep-empty-icon">
            <i className="bx bx-file-blank" aria-hidden />
          </div>
          <p className="cep-empty-title">{APPLICANT_LABELS.NO_COVER_LETTER_TITLE}</p>
          <p className="cep-empty-desc">{APPLICANT_LABELS.NO_COVER_LETTER_DESC}</p>
        </div>
      );
    }
    return (
      <div className="cover-letter cep-cover-letter">
        <p className="cover-letter-text">{coverLetter}</p>
      </div>
    );
  }

  const cl = coverLetter ? truncateText(coverLetter, 50) : null;

  return (
    <div className="cover-letter">
      <div className="cover-letter-label">
        <i className="bx bx-notepad" />
        {APPLICANT_LABELS.COVER_LETTER}
      </div>
      {cl ? (
        <p className="cover-letter-text">
          {cl.text}
          {cl.truncated && (
            <button className="read-more" onClick={(e) => { e.stopPropagation(); onReadMore(applicantId); }}>
              {APPLICANT_LABELS.READ_MORE}
            </button>
          )}
        </p>
      ) : (
        <p className="cover-letter-text">{APPLICANT_LABELS.NO_COVER_LETTER}</p>
      )}
    </div>
  );
};

export default CardCoverLetterTab;
