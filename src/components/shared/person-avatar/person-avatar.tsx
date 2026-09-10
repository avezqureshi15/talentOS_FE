import type { CSSProperties, MouseEvent } from "react";
import { useTooltip } from "../tooltip/use-tooltip";
import { PersonTooltip } from "./person-tooltip";
import { getInitials } from "@/utils/user";
import type { Person } from "./person.types";

export type PersonAvatarProps = {
  person: Person;
  /** existing avatar class (e.g. "employees-avatar") — styling stays in the caller */
  className?: string;
  /** extra class for the tooltip popup */
  tooltipClassName?: string;
  style?: CSSProperties;
  delay?: number;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
};

/**
 * Drop-in replacement for any person avatar: renders the same initials div
 * (caller's className/style preserved) and adds a rich hover tooltip with
 * name, designation, email + phone (when available) and copy buttons.
 */
export function PersonAvatar({
  person,
  className,
  tooltipClassName,
  style,
  delay,
  onClick,
}: PersonAvatarProps) {
  const { anchorRef, visible, position, anchorRect, triggerProps, keepOpen, close } =
    useTooltip<HTMLDivElement>({ openDelay: delay });

  return (
    <>
      <div
        ref={anchorRef}
        className={className}
        style={style}
        onClick={onClick}
        {...triggerProps}
      >
        {person.fallbackLabel ?? getInitials(person.name)}
      </div>
      {visible && anchorRect && (
        <PersonTooltip
          person={person}
          anchorRect={anchorRect}
          position={position}
          className={tooltipClassName}
          onMouseEnter={keepOpen}
          onMouseLeave={close}
        />
      )}
    </>
  );
}
