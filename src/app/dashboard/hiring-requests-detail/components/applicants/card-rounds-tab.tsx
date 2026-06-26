import { APPLICANT_LABELS } from "@/constants/constants";
import type { InterviewRound } from "./applicants.types";

type Props = {
  rounds?: InterviewRound[];
  onViewRound?: (roundId: string) => void;
};

const CardRoundsTab = ({ rounds, onViewRound }: Props) => (
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

export default CardRoundsTab;
