import { useMemo } from "react";
import { STATE_CONFIGS, INFO_CHIP_STATUSES } from "../applicants.constants";
import type { Applicant, HiringState, StateConfig } from "../applicants.types";

export function useApplicantState(
  applicant: Applicant,
  isScreening: boolean,
): StateConfig {
  return useMemo(() => {
    const hiringState = computeHiringState(applicant, isScreening);
    const config = STATE_CONFIGS[hiringState] ?? STATE_CONFIGS.under_evaluation;
    return {
      ...config,
      actions: config.actions.filter(
        (a) => !(a.handler === "onCancelInterview" && applicant.stage === "AI_SCREENING"),
      ),
      showInfoChips: INFO_CHIP_STATUSES.has(hiringState),
    };
  }, [applicant, isScreening]);
}

function computeHiringState(
  applicant: Applicant,
  isScreening: boolean,
): HiringState {
  if (applicant.finalVerdict === "selected") return "selected";
  if (applicant.finalVerdict === "rejected") return "rejected";
  if (applicant.finalVerdict === "on-hold") return "on-hold";

  const status = applicant.status?.toLowerCase();

  switch (status) {
    case "under_evaluation":
      return "under_evaluation";
    case "resume_shortlisted":
    case "shortlisted":
      return isScreening ? "move_to_next_round" : "shortlisted";
    case "move_to_next_round":
      return "move_to_next_round";
    case "waiting_for_review":
      return "waiting_for_review";
    case "interview_cancelled":
      return "interview_cancelled";
    case "interview_rescheduled":
      return "interview_rescheduled";
    case "interview_scheduled":
    case "scheduled":
      return "interview_scheduled";
    case "screening_round_scheduled":
      return "screening_round_scheduled";
    case "rejected":
      return "rejected";
    default:
      return "under_evaluation";
  }
}
