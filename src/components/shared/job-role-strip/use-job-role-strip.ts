import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/app/auth/hooks/use-auth";
import { QUERY_KEYS } from "@/constants/constants";
import { getJobTeam } from "@/app/dashboard/hiring-requests-detail/components/team-members/team-members.service";
import {
  JOB_ROLE_LABELS,
  type JobRole,
} from "@/app/dashboard/hiring-requests-detail/components/team-members/team-members.types";
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

type JobTeamMemberRow = { user_id: number; role: string };

type JobTeamPayload = {
  hiring_request_id: string;
  data: JobTeamMemberRow[];
  total: number;
};

const ORG_ROLES = new Set(["superadmin", "account_admin"]);

const resolveRoleInfo = (orgRole: string | undefined, memberRole: string | undefined): RoleStripInfo => {
  if (orgRole !== undefined && ORG_ROLES.has(orgRole)) {
    return {
      text: JOB_ROLE_STRIP_LABELS.FULL_ACCESS_TEXT,
      label: ACCESS_BADGE_LABELS.FULL_ACCESS,
      tooltip: FULL_ACCESS_TOOLTIP,
      icon: ORG_ACCESS_ICON,
    };
  }
  if (memberRole !== undefined && memberRole in JOB_ROLE_ICONS) {
    const role = memberRole as JobRole;
    return {
      text: JOB_ROLE_STRIP_LABELS.ACCESS_TEXT(JOB_ROLE_LABELS[role]),
      label: ACCESS_BADGE_LABELS.ROLE_ACCESS(JOB_ROLE_LABELS[role]),
      tooltip: ROLE_ACCESS_TOOLTIPS[role],
      icon: JOB_ROLE_ICONS[role],
    };
  }
  return { text: null, label: null, tooltip: null, icon: "" };
};

export const useJobRoleStrip = (hiringRequestId: string) => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.JOB_TEAM, hiringRequestId],
    queryFn: async () => {
      const { data: payload } = await getJobTeam(hiringRequestId);
      return payload as JobTeamPayload;
    },
    enabled: !!hiringRequestId,
  });

  // UI state: per-job strip dismissal, persisted in sessionStorage
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(ROLE_STRIP_DISMISS_KEY(hiringRequestId)) === "1",
  );

  const dismiss = useCallback(() => {
    sessionStorage.setItem(ROLE_STRIP_DISMISS_KEY(hiringRequestId), "1");
    setDismissed(true);
  }, [hiringRequestId]);

  const member = data?.data.find((m) => m.user_id === user?.id);
  const info = resolveRoleInfo(user?.role, member?.role);
  // Access resolved from the job team, independent of banner dismissal state
  const resolved = !isLoading && !isError && info.label !== null;
  const visible = resolved && !dismissed;

  return { ...info, resolved, visible, dismiss };
};
