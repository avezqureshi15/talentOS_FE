export const PERSONA_LABELS: Record<string, string> = {
  superadmin: "Super Admin",
  account_admin: "Account Admin",
  job_owner: "Job Owner",
  reviewer: "Reviewer",
};

export const getPersonaLabel = (role?: string | null): string | null =>
  role ? (PERSONA_LABELS[role] ?? role) : null;
