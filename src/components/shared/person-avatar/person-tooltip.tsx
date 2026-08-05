import { TooltipContent } from "../tooltip/tooltip";
import type { TooltipPosition } from "../tooltip/tooltip.types";
import { useCopyToClipboard } from "../copy-to-clipboard/use-copy-to-clipboard";
import { getInitials } from "@/utils/user";
import type { Person } from "./person.types";
import { PERSON_TOOLTIP_LABELS } from "./person-tooltip.constants";
import "./person-tooltip.css";

export type PersonTooltipProps = {
  person: Person;
  anchorRect: DOMRect;
  position: TooltipPosition;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

type CopyableRowProps = {
  label: string;
  value: string;
};

const CopyableRow = ({ label, value }: CopyableRowProps) => {
  const { copied, copy } = useCopyToClipboard();
  return (
    <div className="person-tip-row">
      <span className="person-tip-row-label">{label}</span>
      <span className="person-tip-row-value" title={value}>
        {value}
      </span>
      <button
        type="button"
        className={`person-tip-copy${copied ? " person-tip-copy--copied" : ""}`}
        onClick={() => copy(value)}
        aria-label={`${PERSON_TOOLTIP_LABELS.COPY_ARIA_PREFIX}${label}`}
        title={copied ? PERSON_TOOLTIP_LABELS.COPIED : PERSON_TOOLTIP_LABELS.COPY}
      >
        <i className={`bx ${copied ? "bx-check" : "bx-copy-alt"}`} />
      </button>
    </div>
  );
};

export function PersonTooltip({
  person,
  anchorRect,
  position,
  className,
  onMouseEnter,
  onMouseLeave,
}: PersonTooltipProps) {
  return (
    <TooltipContent
      anchorRect={anchorRect}
      position={position}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="person-tip">
        <div className="person-tip-header">
          <div className="person-tip-mini-avatar">{getInitials(person.name)}</div>
          <div className="person-tip-header-copy">
            <div className="person-tip-name">{person.name}</div>
            {person.designation && (
              <div className="person-tip-designation">{person.designation}</div>
            )}
          </div>
        </div>
        {person.email && (
          <CopyableRow label={PERSON_TOOLTIP_LABELS.EMAIL} value={person.email} />
        )}
        {person.phone && (
          <CopyableRow label={PERSON_TOOLTIP_LABELS.PHONE} value={person.phone} />
        )}
        {person.extraFields?.map((field) => (
          <CopyableRow key={field.label} label={field.label} value={field.value} />
        ))}
      </div>
    </TooltipContent>
  );
}
