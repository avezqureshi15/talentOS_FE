import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

export type CandidateTableProps = {
  data: Applicant[];
  onRowClick?: (candidate: Applicant) => void;
};
