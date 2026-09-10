import type { TooltipPosition } from "../tooltip/tooltip.types";

export type InfoChipTooltipProps = {
  lines: string[];
  rect: DOMRect;
  className?: string;
  /** preferred side; flips automatically when the box would overflow the viewport */
  position?: TooltipPosition;
};
