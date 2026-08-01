export const ASSIGN_MEMBER_MODAL = {
  TITLE: "Assign Members",
  JOB_HINT: "Multi-select users to add to this job's team. Assigned members are added with the selected role.",
  SEARCH_LABEL: "Search users",
  SEARCH_PLACEHOLDER: "Type a name or email...",
  ROLE_LABEL: "Assign as",
  PRIMARY_ROLE: "Primary role",
  LOADING: "Loading users...",
  EMPTY: "No users found",
  NOT_ASSIGNED: "Not assigned",
  SELECT_HINT: "Select at least one user",
  SELECTED: (n: number) => `${n} selected`,
  ASSIGN: (n: number) => `Assign${n > 0 ? ` (${n})` : ""}`,
  ASSIGNING: "Assigning...",
  CANCEL: "Cancel",
  SUCCESS: (n: number) => `Assigned ${n} member${n === 1 ? "" : "s"} to the job`,
  PARTIAL: (ok: number, failed: number) =>
    `Assigned ${ok} member${ok === 1 ? "" : "s"} — ${failed} failed`,
} as const;
