import { atsScoreClass } from "./ats-score";

type AtsScoreChipProps = {
  score: number;
  labeled?: boolean;
};

export function AtsScoreChip({ score, labeled = false }: AtsScoreChipProps) {
  return (
    <span className={`ats-score ${atsScoreClass(score)}`}>
      {labeled ? `Score: ${score}` : score}
    </span>
  );
}
