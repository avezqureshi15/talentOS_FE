import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";
import type { StageColumn } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.types";

export type CandidateTableProps = {
  data: Applicant[];
  columns: StageColumn[];
  onRowClick?: (candidate: Applicant) => void;
  onInfoClick?: (candidate: Applicant) => void;
};
