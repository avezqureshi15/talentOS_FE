import { createPortal } from "react-dom";
import "./info-chip-tooltip.css";

type InfoChipTooltipProps = {
  lines: string[];
  rect: DOMRect;
  className?: string;
};

const InfoChipTooltip = ({ lines, rect, className }: InfoChipTooltipProps) => createPortal(
  <div className={`info-chip-tooltip${className ? ` ${className}` : ""}`} style={{ top: rect.top - 8, left: rect.left + rect.width / 2 }}>
    {lines.map((line, idx) => (
      <div key={idx} className={idx === 0 ? "info-chip-tip-title" : "info-chip-tip-line"}>{line}</div>
    ))}
  </div>,
  document.body,
);

export default InfoChipTooltip;
