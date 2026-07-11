import { APPLICANT_LABELS } from "@/constants/constants";
import { useApplicationRounds } from "./hooks/use-application-rounds";

type Props = {
  candidateId: number;
  onViewRound?: (roundId: string) => void;
};

const CardRoundsTab = ({ candidateId, onViewRound }: Props) => {
  const { data: rounds, isLoading, isError, refetch } = useApplicationRounds(candidateId);

  if (isLoading) {
    return (
      <div className="cover-letter">
        <div className="cover-letter-label">
          <i className="bx bx-repeat" />
          {APPLICANT_LABELS.ROUNDS}
        </div>
        <p className="cover-letter-text">{APPLICANT_LABELS.LOADING_ROUNDS}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="cover-letter">
        <div className="cover-letter-label">
          <i className="bx bx-repeat" />
          {APPLICANT_LABELS.ROUNDS}
        </div>
        <button className="action-link action-link-btn" onClick={(e) => { e.stopPropagation(); refetch(); }} type="button">
          {APPLICANT_LABELS.RETRY_ROUNDS}
        </button>
      </div>
    );
  }

  return (
    <div className="cover-letter">
      <div className="cover-letter-label">
        <i className="bx bx-repeat" />
        {APPLICANT_LABELS.ROUNDS}
      </div>
      {rounds && rounds.length > 0 ? (
        <div className="rounds-chips">
          {rounds.map((r) => (
            <button
              key={r.id}
              className="round-chip"
              onClick={(e) => { e.stopPropagation(); onViewRound?.(r.id); }}
              type="button"
            >
              {r.round}
            </button>
          ))}
        </div>
      ) : (
        <p className="cover-letter-text">{APPLICANT_LABELS.NO_ROUNDS}</p>
      )}
    </div>
  );
};

export default CardRoundsTab;
