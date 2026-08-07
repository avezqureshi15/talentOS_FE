import { useTooltip } from "@/components/shared/tooltip/use-tooltip";
import { TooltipContent } from "@/components/shared/tooltip/tooltip";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";
import { getScreeningChipClass, getScreeningFlagReason, getScreeningStatusLabel } from "./screening-actions.utils";

type ScreeningStatusBadgeProps = {
  candidate: Applicant;
};

export const ScreeningStatusBadge = ({ candidate }: ScreeningStatusBadgeProps) => {
  const { anchorRef, visible, position, anchorRect, triggerProps, keepOpen, close } =
    useTooltip<HTMLSpanElement>();

  const label = getScreeningStatusLabel(candidate);
  const flagReason = getScreeningFlagReason(candidate);
  const cssClass = getScreeningChipClass(label);
  const interactive = !!flagReason;

  const chip = (
    <span
      ref={anchorRef}
      className={`status-chip status-chip--${cssClass}${interactive ? " status-chip--interactive" : ""}`}
      {...(interactive ? triggerProps : undefined)}
    >
      {label}
      {interactive && <i className="bx bx-info-circle status-chip--flag-icon" />}
    </span>
  );

  return (
    <>
      {chip}
      {interactive && visible && anchorRect && (
        <TooltipContent
          anchorRect={anchorRect}
          position={position}
          className="why-flagged-tooltip"
          onMouseEnter={keepOpen}
          onMouseLeave={close}
        >
          {flagReason}
        </TooltipContent>
      )}
    </>
  );
};

export default ScreeningStatusBadge;
