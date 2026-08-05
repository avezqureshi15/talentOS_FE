import type { ReactNode } from "react";

export type TooltipPosition = "top" | "bottom";

export type UseTooltipOptions = {
  /** delay in ms before the tooltip opens on anchor hover */
  openDelay?: number;
  /** delay in ms before the tooltip closes after leaving anchor/tooltip */
  closeDelay?: number;
};

export type TooltipPlacement = {
  /** final side the tooltip settled on after the fit check */
  pos: TooltipPosition;
  left: number;
  top: number;
  /** arrow center offset (px) relative to the tooltip box, keeps arrow on anchor */
  arrowX: number;
};

export type ComputeTooltipPlacementParams = {
  anchorRect: DOMRect;
  /** measured size + viewport position of the rendered tooltip box */
  box: DOMRect;
  preferred: TooltipPosition;
  viewport?: { width: number; height: number };
};

export type TooltipContentProps = {
  anchorRect: DOMRect;
  /** preferred side; flips automatically when the box would overflow the viewport */
  position?: TooltipPosition;
  className?: string;
  /** if true the tooltip keeps a close-delay bridge so the pointer can travel into it */
  interactive?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children: ReactNode;
};
