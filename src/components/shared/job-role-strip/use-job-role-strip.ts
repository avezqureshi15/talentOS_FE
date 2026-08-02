import { useCallback, useState } from "react";
import { useAuth } from "@/app/auth/hooks/use-auth";
import { ROLE_DISPLAY } from "@/constants/role-display";
import {
  ACCESS_BADGE_LABELS,
  JOB_ROLE_ICONS,
  JOB_ROLE_STRIP_LABELS,
  ORG_ACCESS_ICON,
  ROLE_ACCESS_TOOLTIPS,
  FULL_ACCESS_TOOLTIP,
  ROLE_STRIP_DISMISS_KEY,
} from "./job-role-strip.constants";
import type { RoleStripInfo } from "./job-role-strip.types";

const ORG_ROLES = new Set(["superadmin", "account_admin"]);

const resolveRoleInfo = (orgRole: string | undefined): RoleStripInfo => {
  if (orgRole !== undefined && ORG_ROLES.has(orgRole)) {
    return {
      text: JOB_ROLE_STRIP_LABELS.FULL_ACCESS_TEXT,
      label: ACCESS_BADGE_LABELS.FULL_ACCESS,
      tooltip: FULL_ACCESS_TOOLTIP,
      icon: ORG_ACCESS_ICON,
    };
  }
  const display = orgRole !== undefined ? ROLE_DISPLAY[orgRole] : undefined;
  if (display && orgRole !== undefined && JOB_ROLE_ICONS[orgRole] !== undefined) {
    return {
      text: JOB_ROLE_STRIP_LABELS.ACCESS_TEXT(display.label),
      label: ACCESS_BADGE_LABELS.ROLE_ACCESS(display.label),
      tooltip: ROLE_ACCESS_TOOLTIPS[orgRole],
      icon: JOB_ROLE_ICONS[orgRole],
    };
  }
  return { text: null, label: null, tooltip: null, icon: "" };
};

export const useJobRoleStrip = (hiringRequestId: string) => {
  const { user } = useAuth();

  // UI state: per-job strip dismissal, persisted in sessionStorage
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(ROLE_STRIP_DISMISS_KEY(hiringRequestId)) === "1",
  );

  const dismiss = useCallback(() => {
    sessionStorage.setItem(ROLE_STRIP_DISMISS_KEY(hiringRequestId), "1");
    setDismissed(true);
  }, [hiringRequestId]);

  const info = resolveRoleInfo(user?.role);
  const resolved = info.label !== null;
  const visible = resolved && !dismissed;

  return { ...info, resolved, visible, dismiss };
};
