export const ROLE_DISPLAY: Record<string, { chipVariant: string; label: string }> = {
  superadmin: { chipVariant: "warning", label: "Super Admin" },
  account_admin: { chipVariant: "info", label: "Account Admin" },
  job_owner: { chipVariant: "primary", label: "Job Owner" },
  recruiter: { chipVariant: "success", label: "Recruiter" },
  reviewer: { chipVariant: "neutral", label: "Reviewer" },
};
