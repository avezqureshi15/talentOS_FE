import type { MenuAction } from "../applicants.types";

export type ApplicantMenuButtonProps = {
  menuActions: MenuAction[];
  onMenuAction: (action: MenuAction, id: string) => void;
  id: string;
  /** Renders a trailing "View Profile" item when provided. */
  onViewProfile?: () => void;
  /** Extra classes for the trigger button. */
  className?: string;
  /** Runs before the menu opens (e.g. expanding an accordion card). */
  onBeforeOpen?: () => void;
};
