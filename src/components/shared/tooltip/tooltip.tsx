import { useRef } from "react";
import { createPortal } from "react-dom";
import { useTooltipPlacement } from "./use-tooltip-placement";
import type { TooltipContentProps } from "./tooltip.types";
import "./tooltip.css";

/**
 * Pure presentation: portals the tooltip and delegates all placement math
 * (side flip, viewport clamp, arrow alignment) to useTooltipPlacement.
 * Styling/positioning applied imperatively on the DOM node.
 */
export function TooltipContent({
  anchorRect,
  position = "top",
  className,
  interactive = true,
  onMouseEnter,
  onMouseLeave,
  children,
}: TooltipContentProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  useTooltipPlacement({ contentRef, anchorRect, preferredPosition: position });

  return createPortal(
    <div
      ref={contentRef}
      className={`app-tooltip app-tooltip--${position}${className ? ` ${className}` : ""}`}
      onMouseEnter={interactive ? onMouseEnter : undefined}
      onMouseLeave={interactive ? onMouseLeave : undefined}
    >
      {children}
    </div>,
    document.body,
  );
}
