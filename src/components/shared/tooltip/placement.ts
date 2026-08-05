import { TOOLTIP } from "./tooltip.constants";
import type {
  ComputeTooltipPlacementParams,
  TooltipPlacement,
  TooltipPosition,
} from "./tooltip.types";

const sideFits = (space: number, boxSize: number): boolean => space >= boxSize;

const otherSide = (pos: TooltipPosition): TooltipPosition =>
  pos === "top" ? "bottom" : "top";

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * Pure O(1) placement math: picks the side that fits the measured box
 * (flipping when the preferred side would be chopped), clamps the box
 * edges to the viewport, and keeps the arrow glued to the anchor center.
 */
export const computeTooltipPlacement = ({
  anchorRect,
  box,
  preferred,
  viewport = { width: window.innerWidth, height: window.innerHeight },
}: ComputeTooltipPlacementParams): TooltipPlacement => {
  const margin = TOOLTIP.VIEWPORT_MARGIN;
  const gap = TOOLTIP.ANCHOR_GAP;
  const above = anchorRect.top - gap;
  const below = viewport.height - anchorRect.bottom - gap;

  const preferredFits = sideFits(preferred === "top" ? above : below, box.height);
  const alternateFits = sideFits(otherSide(preferred) === "top" ? above : below, box.height);
  const pos = !preferredFits && alternateFits ? otherSide(preferred) : preferred;

  let top = pos === "top" ? anchorRect.top - gap - box.height : anchorRect.bottom + gap;
  if (box.height < viewport.height - margin * 2) {
    top = clamp(top, margin, viewport.height - box.height - margin);
  }

  let left = anchorRect.left + anchorRect.width / 2 - box.width / 2;
  if (box.width < viewport.width - margin * 2) {
    left = clamp(left, margin, viewport.width - box.width - margin);
  }

  const arrowX = clamp(
    anchorRect.left + anchorRect.width / 2 - left,
    TOOLTIP.ARROW_MIN_OFFSET,
    box.width - TOOLTIP.ARROW_MIN_OFFSET,
  );

  return { pos, left, top, arrowX };
};
