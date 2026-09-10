import { APPLICANT_LABELS } from "@/constants/constants";
import { VERDICT_CONFIG } from "./card-rounds-tab.constants";
import { useApplicationRounds } from "./hooks/use-application-rounds";

type Props = {
  candidateId: number;
  jdId?: string;
};

const verdictLabel = (v: string | null): string => {
  if (!v) return "-";
  return VERDICT_CONFIG[v] ?? v;
};

const CardRoundsTab = ({ candidateId, jdId }: Props) => {
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
        <div className="rounds-table">
          <div className="rounds-table-header">
            <span className="rounds-table-cell rounds-table-cell--name">Round</span>
            <span className="rounds-table-cell rounds-table-cell--type">Type</span>
            <span className="rounds-table-cell rounds-table-cell--verdict">Verdict</span>
          </div>
          {rounds.map((r) => (
            <button
              key={r.id}
              className="rounds-table-row"
              onClick={(e) => { e.stopPropagation(); if (jdId) { window.open(`/hiring-requests/${jdId}/round-details/${r.id}?candidateId=${candidateId}`, "_blank"); } }}
              type="button"
            >
              <span className="rounds-table-cell rounds-table-cell--name">{r.round}</span>
              <span className="rounds-table-cell rounds-table-cell--type">{r.roundType ?? "-"}</span>
              <span className="rounds-table-cell rounds-table-cell--verdict">{verdictLabel(r.roundVerdict)}</span>
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
