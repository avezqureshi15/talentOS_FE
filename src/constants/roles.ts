export const ROLES = ["superadmin", "admin", "hr", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_HIERARCHY: Record<Role, number> = {
  superadmin: 40,
  admin: 30,
  hr: 20,
  viewer: 10,
};

export function hasMinimumRole(userRole: Role | undefined, minimumRole: Role): boolean {
  if (!userRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole];
}
