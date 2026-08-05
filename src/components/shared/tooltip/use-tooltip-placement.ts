import { useCallback, useEffect, useLayoutEffect } from "react";
import type { RefObject } from "react";
import { computeTooltipPlacement } from "./placement";
import type { TooltipPosition } from "./tooltip.types";

type UseTooltipPlacementParams = {
  contentRef: RefObject<HTMLDivElement | null>;
  anchorRect: DOMRect | null;
  preferredPosition: TooltipPosition;
};

/**
 * Measures the rendered tooltip box and applies the final placement
 * (side flip + viewport clamp + arrow offset) straight onto the DOM.
 * Pure DOM work only — no state, no re-renders.
 */
export function useTooltipPlacement({ contentRef, anchorRect, preferredPosition }: UseTooltipPlacementParams) {
  const applyPlacement = useCallback(
    (anchor: DOMRect) => {
      const el = contentRef.current;
      if (!el) return;
      const box = el.getBoundingClientRect();
      if (box.width === 0 && box.height === 0) return;
      const placement = computeTooltipPlacement({
        anchorRect: anchor,
        box,
        preferred: preferredPosition,
      });
      el.style.left = `${placement.left}px`;
      el.style.top = `${placement.top}px`;
      el.style.setProperty("--tooltip-arrow-x", `${placement.arrowX}px`);
      el.classList.toggle("app-tooltip--top", placement.pos === "top");
      el.classList.toggle("app-tooltip--bottom", placement.pos === "bottom");
    },
    [contentRef, preferredPosition],
  );

  // justification: layout measurement must run synchronously before paint so the
  // tooltip never renders at an unclamped position (no alternative to useLayoutEffect)
  useLayoutEffect(() => {
    if (anchorRect) applyPlacement(anchorRect);
  }, [anchorRect, applyPlacement]);

  // justification: event-listener subscription — re-applies placement when the
  // tooltip's own size changes after mount (font load, dynamic rows)
  useEffect(() => {
    const el = contentRef.current;
    if (!el || !anchorRect) return;
    const observer = new ResizeObserver(() => applyPlacement(anchorRect));
    observer.observe(el);
    return () => observer.disconnect();
  }, [contentRef, anchorRect, applyPlacement]);
}
