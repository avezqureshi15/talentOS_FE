export type ApiKeyRole = "account_admin" | "job_owner" | "reviewer";

export const API_KEY_ROLES: { value: ApiKeyRole; label: string; hint: string }[] = [
  {
    value: "account_admin",
    label: "Account Admin",
    hint: "Full tenant access — manage users, settings, apps, and all jobs/applications.",
  },
  {
    value: "job_owner",
    label: "Job Owner",
    hint: "Create and manage jobs and their applications, reviews, and interviews.",
  },
  {
    value: "reviewer",
    label: "Reviewer",
    hint: "View jobs and applications only — no candidate status changes.",
  },
];

export const API_KEY_ROLE_LABELS: Record<string, string> = Object.fromEntries(
  API_KEY_ROLES.map((r) => [r.value, r.label]),
) as Record<string, string>;