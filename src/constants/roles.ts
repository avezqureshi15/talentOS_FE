export const ROLES = [
  "superadmin",
  "account_admin",
  "job_owner",
  "reviewer",
] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_HIERARCHY: Record<Role, number> = {
  superadmin: 50,
  account_admin: 40,
  job_owner: 35,
  reviewer: 25,
};

export function hasMinimumRole(userRole: Role | undefined, minimumRole: Role): boolean {
  if (!userRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole];
}
