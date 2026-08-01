import type { JobRole } from "@/app/dashboard/hiring-requests-detail/components/team-members/team-members.types";

export const JOB_ROLE_STRIP_LABELS = {
  ACCESS_TEXT: (role: string) => `You have ${role} access on this Job`,
  FULL_ACCESS_TEXT: "You have full access to this Job",
  DISMISS_ARIA: "Dismiss role strip",
} as const;

export const ACCESS_BADGE_LABELS = {
  FULL_ACCESS: "Full Access",
  ROLE_ACCESS: (role: string) => `${role} Access`,
} as const;

export const ROLE_ACCESS_TOOLTIPS: Record<JobRole, string> = {
  reviewer: "You have view & review permissions for this job listing.",
  recruiter: "You have manage & shortlist permissions for this job listing.",
  job_owner: "You own this job listing and can manage its team.",
};

export const FULL_ACCESS_TOOLTIP = "You have full access to this job listing.";

export const JOB_ROLE_ICONS: Record<string, string> = {
  job_owner: "bx-briefcase-alt",
  recruiter: "bx-user-check",
  reviewer: "bx-user-voice",
};

export const ORG_ACCESS_ICON = "bx-shield-alt-2";

export const ROLE_STRIP_DISMISS_KEY = (jobId: string) => `hr-role-strip:${jobId}`;
