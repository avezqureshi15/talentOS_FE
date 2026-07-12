import { useMemo } from "react";
import { STATE_CONFIGS } from "../applicants.constants";
import type { Applicant, HiringState, StateConfig } from "../applicants.types";

export function useApplicantState(
  applicant: Applicant,
  isScreening: boolean,
): StateConfig {
  return useMemo(() => {
    const hiringState = computeHiringState(applicant, isScreening);
    return STATE_CONFIGS[hiringState] ?? STATE_CONFIGS.under_evaluation;
  }, [applicant, isScreening]);
}

function computeHiringState(
  applicant: Applicant,
  isScreening: boolean,
): HiringState {
  if (applicant.finalVerdict === "selected") return "selected";
  if (applicant.finalVerdict === "rejected") return "rejected";

  const status = applicant.status;

  switch (status) {
    case "under_evaluation":
      return "under_evaluation";
    case "shortlisted":
      return isScreening ? "move_to_next_round" : "shortlisted";
    case "scheduled":
      return "interview_scheduled";
    case "rejected":
      return "rejected";
    default:
      return "under_evaluation";
  }
}
