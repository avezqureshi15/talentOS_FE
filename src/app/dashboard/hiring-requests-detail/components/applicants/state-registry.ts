import type { Applicant, HiringState } from "./applicants.types";

type StateMatcher = (applicant: Applicant, isScreening: boolean) => HiringState | null;

const matchers: StateMatcher[] = [
  // Terminal states — finalVerdict overrides status
  (a) => (a.finalVerdict === "selected" ? "selected" : null),
  (a) => (a.finalVerdict === "rejected" ? "rejected" : null),
  (a) => (a.finalVerdict === "on-hold" ? "on-hold" : null),

  // Status-based states
  (a) => {
    const status = a.status?.toLowerCase();
    return status === "under_evaluation" ? "under_evaluation" : null;
  },
  (a, isScreening) => {
    const status = a.status?.toLowerCase();
    if (status === "resume_shortlisted" || status === "shortlisted") {
      return isScreening ? "move_to_next_round" : "shortlisted";
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
