import { TooltipContent } from "../tooltip/tooltip";
import type { InfoChipTooltipProps } from "./info-chip-tooltip.types";
import "./info-chip-tooltip.css";

const InfoChipTooltip = ({ lines, rect, className, position = "top" }: InfoChipTooltipProps) => (
  <TooltipContent
    anchorRect={rect}
    position={position}
    className={`info-chip-tooltip${className ? ` ${className}` : ""}`}
    interactive={false}
  >
    {lines.map((line, idx) => (
      <div key={idx} className={idx === 0 ? "info-chip-tip-title" : "info-chip-tip-line"}>
        {line}
      </div>
    ))}
  </TooltipContent>
);

export default InfoChipTooltip;
