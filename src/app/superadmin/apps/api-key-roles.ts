export type ApiKeyRole = "account_admin" | "job_owner" | "recruiter" | "reviewer";

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
    value: "recruiter",
    label: "Recruiter",
    hint: "Work on assigned jobs — evaluate, shortlist, review, and schedule.",
  },
  {
    value: "reviewer",
    label: "Reviewer",
    hint: "View jobs and applications, evaluate candidates, and submit reviews.",
  },
];

export const API_KEY_ROLE_LABELS: Record<string, string> = Object.fromEntries(
  API_KEY_ROLES.map((r) => [r.value, r.label]),
) as Record<string, string>;