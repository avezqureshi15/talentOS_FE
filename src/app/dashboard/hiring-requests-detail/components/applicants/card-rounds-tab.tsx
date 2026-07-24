import Chip from "@/components/ui/chip/chip";
import { APPLICANT_LABELS } from "@/constants/constants";
import { ROUNDS_TAB_LABELS } from "./card-rounds-tab.constants";
import { useApplicationRounds } from "./hooks/use-application-rounds";
import { resolveLastRoundId, resolveRoundDecision } from "./round-display.helpers";

type Props = {
  candidateId: number;
  currentRoundId?: string;
  reviewVerdict?: string;
  onViewRound?: (roundId: string) => void;
};

const CardRoundsTab = ({
  candidateId,
  currentRoundId,
  reviewVerdict,
  onViewRound,
}: Props) => {
  const { data: rounds, isLoading, isError, refetch } = useApplicationRounds(candidateId);
  const effectiveCurrentRoundId = resolveLastRoundId(currentRoundId, rounds);

  if (isLoading) {
    return (
      <div className="cover-letter">
        <div className="cover-letter-label rounds-section-title">
          <i className="bx bx-calendar-check" aria-hidden />
          {ROUNDS_TAB_LABELS.SECTION_TITLE}
        </div>
        <p className="cover-letter-text">{APPLICANT_LABELS.LOADING_ROUNDS}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="cover-letter">
        <div className="cover-letter-label rounds-section-title">
          <i className="bx bx-calendar-check" aria-hidden />
          {ROUNDS_TAB_LABELS.SECTION_TITLE}
        </div>
        <button
          className="action-link action-link-btn"
          onClick={(e) => {
            e.stopPropagation();
            refetch();
          }}
          type="button"
        >
          {APPLICANT_LABELS.RETRY_ROUNDS}
        </button>
      </div>
    );
  }

  return (
    <div className="cover-letter">
      <div className="cover-letter-label rounds-section-title">
        <i className="bx bx-calendar-check" aria-hidden />
        {ROUNDS_TAB_LABELS.SECTION_TITLE}
      </div>
      {rounds && rounds.length > 0 ? (
        <div className="rounds-table">
          <div className="rounds-table-header" role="row">
            <span className="rounds-table-cell rounds-table-cell--name rounds-table-heading">
              {ROUNDS_TAB_LABELS.COL_ROUND}
            </span>
            <span className="rounds-table-cell rounds-table-cell--verdict rounds-table-heading">
              {ROUNDS_TAB_LABELS.COL_DECISION}
            </span>
          </div>
          {rounds.map((r) => {
            const decision = resolveRoundDecision({
              roundId: r.id,
              roundVerdict: r.roundVerdict,
              currentRoundId: effectiveCurrentRoundId,
              reviewVerdict,
            });
            return (
              <button
                key={r.id}
                className="rounds-table-row"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewRound?.(r.id);
                }}
                type="button"
              >
                <span className="rounds-table-cell rounds-table-cell--name">
                  <i className="bx bx-briefcase rounds-row-icon" aria-hidden />
                  {r.round}
                </span>
                <span className="rounds-table-cell rounds-table-cell--verdict">
                  <Chip variant={decision.chipVariant} size="sm">
                    {decision.text}
                  </Chip>
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <p className="cover-letter-text">{APPLICANT_LABELS.NO_ROUNDS}</p>
      )}
    </div>
  );
};

export default CardRoundsTab;
