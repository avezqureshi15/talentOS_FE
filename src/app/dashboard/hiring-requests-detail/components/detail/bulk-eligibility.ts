import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

const BLOCKED = new Set([
  "interview_scheduled",
  "interview_rescheduled",
  "ongoing",
]);

export function canBulkAdvance(applicant: Applicant): boolean {
  if (applicant.finalVerdict) return false;
  const status = applicant.status?.toLowerCase() ?? "";
  return !BLOCKED.has(status);
}
