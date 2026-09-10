import { useTooltip } from "../tooltip/use-tooltip";
import { TooltipContent } from "../tooltip/tooltip";
import type { TruncatedCellProps } from "./truncated-cell.types";
import "./truncated-cell.css";

const DEFAULT_MAX_CHARS = 25;

/**
 * Cell text that cuts off at a fixed character count and shows the full value
 * in the global tooltip only when it is actually truncated. Reuses the shared
 * useTooltip/TooltipContent system (portaled, auto side-flip, token-styled).
 */
export function TruncatedCell({
  text,
  maxChars = DEFAULT_MAX_CHARS,
  className,
  tooltipClassName,
}: TruncatedCellProps) {
  const isTruncated = text.length > maxChars;
  const display = isTruncated ? `${text.slice(0, maxChars)}...` : text;
  const { anchorRef, visible, position, anchorRect, triggerProps } =
    useTooltip<HTMLSpanElement>();

  return (
    <>
      <span
        ref={(node) => {
          anchorRef.current = node;
        }}
        className={`truncated-cell${className ? ` ${className}` : ""}`}
        {...(isTruncated ? triggerProps : undefined)}
      >
        {display}
      </span>
      {isTruncated && visible && anchorRect && (
        <TooltipContent
          anchorRect={anchorRect}
          position={position}
          className={`truncated-tooltip${tooltipClassName ? ` ${tooltipClassName}` : ""}`}
        >
          <span className="truncated-tooltip-text">{text}</span>
        </TooltipContent>
      )}
    </>
  );
}
