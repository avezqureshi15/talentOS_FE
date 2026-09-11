import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

export type EditCandidateDetailsModalProps = {
  open: boolean;
  applicant: Applicant | null;
  onClose: () => void;
  onSaved?: () => void;
};
