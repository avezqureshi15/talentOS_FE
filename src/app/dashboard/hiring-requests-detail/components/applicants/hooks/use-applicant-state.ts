import { useMemo } from "react";
import { STATE_CONFIGS, INFO_CHIP_STATUSES, ATS_SCORE_STATUSES } from "../applicants.constants";
import {
  normalizeApplicantStatus,
  resolveChipForHiringState,
} from "../applicant-status.helpers";
import type { Applicant, HiringState, StateConfig } from "../applicants.types";

export function useApplicantState(
  applicant: Applicant,
  isScreening: boolean,
): StateConfig {
  return useMemo(() => {
    const hiringState = computeHiringState(applicant, isScreening);
    const config = STATE_CONFIGS[hiringState] ?? STATE_CONFIGS.under_evaluation;
    const chip = resolveChipForHiringState(
      hiringState,
      config.chip,
      applicant.activeInterview,
    );

    return {
      ...config,
      chip,
      showInfoChips: INFO_CHIP_STATUSES.has(hiringState),
      showAtsScore: ATS_SCORE_STATUSES.has(hiringState),
    };
  }, [applicant, isScreening]);
}

function computeHiringState(
  applicant: Applicant,
  isScreening: boolean,
): HiringState {
  const final = applicant.finalVerdict?.toLowerCase();
  if (final === "selected") return "selected";
  if (final === "rejected") return "rejected";

  const status = normalizeApplicantStatus(applicant.status);

  switch (status) {
    case "queued":
      return "queued";
    case "processing":
      return "processing";
    case "under_evaluation":
      return "under_evaluation";
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
    case "invalid":
      return "invalid";
    case "failed":
      return "failed";
    case "rejected":
    case "moved_out_of_hiring_pipeline":
      return "rejected";
    default:
      return "under_evaluation";
  }
}
