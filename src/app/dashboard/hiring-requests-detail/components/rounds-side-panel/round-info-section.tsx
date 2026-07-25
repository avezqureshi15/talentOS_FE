import { ROUNDS_PANEL_LABELS } from "./rounds-side-panel.constants";
import { buildRoundInfoRows } from "./round-detail-display.helpers";
import type { RoundDetail, RowProps } from "./rounds-side-panel.types";

type RoundInfoSectionProps = {
  round: RoundDetail;
};

const Row = ({ label, icon, value }: RowProps) => {
  if (!value) return null;
  return (
    <div className="rp-row">
      <span className="rp-row-label">
        <i className={icon} aria-hidden /> {label}
      </span>
      <span className="rp-row-value">{value}</span>
    </div>
  );
};

const RoundInfoSection = ({ round }: RoundInfoSectionProps) => {
  const rows = buildRoundInfoRows(round);

  return (
    <div className="rp-group">
      <span className="rp-group-title">{ROUNDS_PANEL_LABELS.ROUND_INFO}</span>
      <div className="rp-details">
        {rows.map((row) => (
          <Row key={row.label} label={row.label} icon={row.icon} value={row.value} />
        ))}
      </div>
    </div>
  );
};

export default RoundInfoSection;
