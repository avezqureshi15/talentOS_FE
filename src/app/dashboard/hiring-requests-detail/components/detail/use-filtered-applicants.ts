import { useMemo } from "react";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";
import type { StageKey } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.types";
import { STAGE_FILTER_MAP, INTERVIEW_SUB_FILTER_MAP, EVALUATED_SUB_FILTER_MAP, SCREENING_SUB_FILTER_MAP } from "./detail.constants";

type UseFilteredApplicantsArgs = {
  applicants: Applicant[];
  activeStage: StageKey;
  interviewSubFilter: string;
  evaluatedSubFilter: string;
  screeningSubFilter: string;
};

export function useFilteredApplicants({
  applicants,
  activeStage,
  interviewSubFilter,
  evaluatedSubFilter,
  screeningSubFilter,
}: UseFilteredApplicantsArgs): Applicant[] {
  return useMemo(() => {
    let filtered = applicants.filter(STAGE_FILTER_MAP[activeStage]);

    if (activeStage === "interview") {
      filtered = filtered.filter(INTERVIEW_SUB_FILTER_MAP[interviewSubFilter]);
    }

    if (activeStage === "evaluated") {
      filtered = filtered.filter(EVALUATED_SUB_FILTER_MAP[evaluatedSubFilter]);
    }

    if (activeStage === "screening") {
      filtered = filtered.filter(SCREENING_SUB_FILTER_MAP[screeningSubFilter]);
    }

    return filtered;
  }, [applicants, activeStage, interviewSubFilter, evaluatedSubFilter, screeningSubFilter]);
}
