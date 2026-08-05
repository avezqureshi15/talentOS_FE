import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

export type CandidateActionKey = "view_profile" | "schedule_round" | "review_candidate";

export type CandidateActionsMenuProps = {
  candidate: Applicant;
  onViewProfile: (candidate: Applicant) => void;
  /** When omitted, the "Schedule Round" item is hidden regardless of status. */
  onScheduleRound?: (candidate: Applicant) => void;
};
