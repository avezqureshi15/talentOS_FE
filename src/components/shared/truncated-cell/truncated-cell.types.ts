export type TruncatedCellProps = {
  /** full text rendered inside the cell (tooltip shows this when truncated) */
  text: string;
  /** max characters before truncation — width is capped at {maxChars}ch */
  maxChars?: number;
  /** class applied to the truncated span (e.g. "dt-cell-name") */
  className?: string;
  /** extra class for the tooltip popup */
  tooltipClassName?: string;
};
