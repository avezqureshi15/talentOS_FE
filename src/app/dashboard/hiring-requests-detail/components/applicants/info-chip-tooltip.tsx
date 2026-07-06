import { createPortal } from "react-dom";

type InfoChipTooltipProps = {
  lines: string[];
  rect: DOMRect;
};

const InfoChipTooltip = ({ lines, rect }: InfoChipTooltipProps) => createPortal(
  <div className="info-chip-tooltip" style={{ top: rect.top - 8, left: rect.left + rect.width / 2 }}>
    {lines.map((line, idx) => (
      <div key={idx} className={idx === 0 ? "info-chip-tip-title" : "info-chip-tip-line"}>{line}</div>
    ))}
  </div>,
  document.body,
);

export default InfoChipTooltip;
