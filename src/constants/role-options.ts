import type { SelectOption } from "@/components/ui/select/select.types";

export const ROLE_OPTIONS: SelectOption[] = [
  { value: "account_admin", label: "Account Admin" },
  { value: "job_owner", label: "Job Owner" },
  { value: "recruiter", label: "Recruiter" },
  { value: "reviewer", label: "Reviewer" },
];
