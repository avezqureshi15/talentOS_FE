import { useMemo } from "react";
import { STATE_CONFIGS, INFO_CHIP_STATUSES } from "../applicants.constants";
import { computeHiringState } from "../state-registry";
import { isScreeningCallCompleted } from "@/app/dashboard/hiring-requests-detail/components/candidate-table/screening-actions/screening-actions.utils";
import type { Applicant, StateConfig } from "../applicants.types";

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
        (a) =>
          !(a.handler === "onCancelInterview" && applicant.stage === "AI_SCREENING") &&
          !(a.handler === "onCallNow" && isScreeningCallCompleted(applicant)),
      ),
      showInfoChips: INFO_CHIP_STATUSES.has(hiringState),
    };
  }, [applicant, isScreening]);
}


