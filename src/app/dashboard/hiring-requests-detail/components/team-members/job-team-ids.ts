import type { UserItem } from "@/services/users/users";
import type { JobTeamMember } from "./team-members.types";

/**
 * Job-team JSON still names the field `user_id`, but the value is
 * `employees.id`. System-user pickers expose that as `employee_id`.
 */
export function employeeIdForJobTeamApi(user: Pick<UserItem, "id" | "employee_id">): number {
  return user.employee_id ?? user.id;
}

export function jobTeamMemberIdSet(members: Pick<JobTeamMember, "user_id">[]): Set<number> {
  return new Set(members.map((m) => m.user_id));
}

export function isUserOnJobTeam(
  user: Pick<UserItem, "id" | "employee_id">,
  teamEmployeeIds: Set<number>,
): boolean {
  return teamEmployeeIds.has(employeeIdForJobTeamApi(user));
}

export function assignableJobTeamUsers(
  users: UserItem[],
  opts: { teamEmployeeIds: Set<number>; excludeUserId?: number },
): UserItem[] {
  return users.filter((user) => {
    if (opts.excludeUserId != null && user.id === opts.excludeUserId) return false;
    return !isUserOnJobTeam(user, opts.teamEmployeeIds);
  });
}
