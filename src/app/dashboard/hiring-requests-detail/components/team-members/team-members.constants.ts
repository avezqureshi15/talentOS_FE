export const TEAM_MEMBERS_LABELS = {
  PAGE_TITLE: "Team Members",
  ADD_MEMBER: "Add Member",
  ROLE_GUIDE: "Role Guide",
  EMPTY_TITLE: "No team members yet",
  EMPTY_SUBTITLE: "Add members to this job to collaborate on hiring.",
  REMOVE_CONFIRM_TITLE: "Remove Team Member",
  REMOVE_CONFIRM_MESSAGE: "Are you sure you want to remove {name} from this job's team?",
  OWNER_BADGE: "Owner",
  MEMBER_BADGE: "Member",
  ROLE_TITLE: "ROLE",
  ROLE_UNASSIGNED: "—",
  MEMBER_TITLE: "TEAM MEMBER",
  LOADING: "Loading team members...",
  FAILED: "Failed to load team members",
} as const;

export const ROLE_LABELS: Record<string, string> = {
  superadmin: "Super Admin",
  account_admin: "Account Admin",
  job_owner: "Job Owner",
  reviewer: "Reviewer",
};

export const formatRoleLabel = (role: string | null | undefined): string => {
  if (!role) return TEAM_MEMBERS_LABELS.ROLE_UNASSIGNED;
  return (
    ROLE_LABELS[role] ??
    role
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
};
