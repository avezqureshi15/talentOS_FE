import { APPLICANT_LABELS } from "@/constants/constants";

type Props = {
  coverLetter: string;
};

const CardCoverLetterTab = ({ coverLetter }: Props) => {
  const text = coverLetter.trim();

  return (
    <div className="cover-letter">
      <div className="cover-letter-label">
        <i className="bx bx-notepad" aria-hidden />
        {APPLICANT_LABELS.COVER_LETTER}
      </div>
      {text ? (
        <div className="cover-letter-scroll">
          <p className="cover-letter-text cover-letter-text--full">{text}</p>
        </div>
      ) : (
        <p className="cover-letter-text">{APPLICANT_LABELS.NO_COVER_LETTER}</p>
      )}
    </div>
  );
};

export default CardCoverLetterTab;
