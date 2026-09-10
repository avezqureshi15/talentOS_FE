import { truncateText } from "./applicants.utils";
import { APPLICANT_LABELS } from "@/constants/constants";

type Props = {
  coverLetter: string;
  applicantId: string;
  onReadMore: (id: string) => void;
};

const CardCoverLetterTab = ({ coverLetter, applicantId, onReadMore }: Props) => {
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
