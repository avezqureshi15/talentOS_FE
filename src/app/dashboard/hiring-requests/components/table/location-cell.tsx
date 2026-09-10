import { useTooltip } from "@/components/shared/tooltip/use-tooltip";
import { TooltipContent } from "@/components/shared/tooltip/tooltip";
import { TruncatedCell } from "@/components/shared/truncated-cell/truncated-cell";
import { formatLocations } from "@/utils/format-locations";
import "./location-cell.css";

type LocationCellProps = {
  locations: string[];
};

/**
 * Location table cell. A single location renders as-is (with the shared
 * truncation tooltip), while multiple locations collapse into a "Multi"
 * label with an info icon whose custom tooltip lists every location.
 */
export function LocationCell({ locations }: LocationCellProps) {
  const list = locations.filter(Boolean);
  const { anchorRef, visible, position, anchorRect, triggerProps } =
    useTooltip<HTMLSpanElement>();

  if (list.length <= 1) {
    return <TruncatedCell text={formatLocations(list)} className="location-cell" />;
  }

  return (
    <>
      <span
        ref={anchorRef}
        className="location-cell location-cell--multi"
        {...triggerProps}
      >
        Multiple
        <i className="bx bx-info-circle location-cell--multi-icon" />
      </span>
      {visible && anchorRect && (
        <TooltipContent
          anchorRect={anchorRect}
          position={position}
          className="location-multi-tooltip"
          interactive={false}
        >
          <span className="location-multi-tooltip-title">All Locations</span>
          {list.map((loc) => (
            <div key={loc} className="location-multi-tooltip-line">
              {loc}
            </div>
          ))}
        </TooltipContent>
      )}
    </>
  );
}

export default LocationCell;