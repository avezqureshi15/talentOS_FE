import type { Applicant, HiringState } from "./applicants.types";
import { isScreeningCallCompleted } from "@/app/dashboard/hiring-requests-detail/components/candidate-table/screening-actions/screening-actions.utils";

type StateMatcher = (applicant: Applicant, isScreening: boolean) => HiringState | null;

const ATS_STAGES = new Set(["RESUME_SHORTLISTING", "RESUME_SHORTLISTED"]);

const matchers: StateMatcher[] = [
  // Terminal states — finalVerdict overrides status
  (a) => (a.finalVerdict === "selected" ? "selected" : null),
  (a) => (a.finalVerdict === "rejected" ? "rejected" : null),
  (a) => (a.finalVerdict === "on-hold" ? "on-hold" : null),

  (a) => (ATS_STAGES.has(a.stage ?? "") ? "resume_shortlisting" : null),

  (a) => {
    const status = a.status?.toLowerCase() ?? "";
    const flagged =
      status === "ai_screening_flagged" ||
      status === "ai_screening_evaluation_failed" ||
      a.screeningReview?.disposition === "flagged";
    if (!flagged && isScreeningCallCompleted(a) && status === "screening_round_scheduled") {
      return "under_evaluation";
    }
    return null;
  },

  // Status-based states
  (a) => {
    const status = a.status?.toLowerCase();
    return status === "under_evaluation" ? "under_evaluation" : null;
  },
  (a) => {
    const status = a.status?.toLowerCase();
    if (status === "shortlisted" || status === "resume_shortlisted") {
      return "move_to_next_round";
    }
    return null;
  },
  (a) => {
    const status = a.status?.toLowerCase();
    return status === "move_to_next_round" ? "move_to_next_round" : null;
  },
  (a) => {
    const status = a.status?.toLowerCase();
    return status === "waiting_for_review" ? "waiting_for_review" : null;
  },
  (a) => {
    const status = a.status?.toLowerCase();
    return status === "interview_cancelled" ? "interview_cancelled" : null;
  },
  (a) => {
    const status = a.status?.toLowerCase();
    return status === "interview_rescheduled" ? "interview_rescheduled" : null;
  },
  (a) => {
    const status = a.status?.toLowerCase();
    return status === "ongoing" ? "ongoing" : null;
  },
  (a) => {
    const status = a.status?.toLowerCase();
    return status === "no_show" ? "no_show" : null;
  },
  (a) => {
    const status = a.status?.toLowerCase();
    if (status === "interview_scheduled" || status === "scheduled") {
      return "interview_scheduled";
    }
    return null;
  },
  (a) => {
    const status = a.status?.toLowerCase();
    return status === "screening_round_scheduled" ? "screening_round_scheduled" : null;
  },
  (a) => {
    const status = a.status?.toLowerCase();
    return status === "ai_screening_evaluation_failed"
      ? "ai_screening_evaluation_failed"
      : null;
  },
  (a) => {
    const status = a.status?.toLowerCase();
    return status === "ai_screening_flagged" ? "ai_screening_flagged" : null;
  },
  (a) => {
    const status = a.status?.toLowerCase();
    return status === "rejected" ? "rejected" : null;
  },

  // Default fallback
  () => "under_evaluation" as HiringState,
];

export function computeHiringState(
  applicant: Applicant,
  isScreening: boolean,
): HiringState {
  for (const matcher of matchers) {
    const result = matcher(applicant, isScreening);
    if (result) return result;
  }
  return "under_evaluation";
}
