import type { ApplicantStatus, Applicant, HiringState } from "./applicants.types";

export type OptimisticUpdate = Partial<{ status: ApplicantStatus; finalVerdict: string }>;

export type Transition = {
  action: string;
  from: readonly HiringState[] | "*";
  to: HiringState;
  guard?: (applicant: Applicant) => boolean;
  optimistic?: (applicant: Applicant) => OptimisticUpdate;
};
