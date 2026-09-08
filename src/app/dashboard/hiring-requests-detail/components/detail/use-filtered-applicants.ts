import { useMemo } from "react";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";
import type { StageKey } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.types";
import { STAGE_FILTER_MAP, INTERVIEW_SUB_FILTER_MAP, EVALUATION_SUB_FILTER_MAP, SCREENING_SUB_FILTER_MAP } from "./detail.constants";

type UseFilteredApplicantsArgs = {
  applicants: Applicant[];
  activeStage: StageKey;
  interviewSubFilter: string;
  evaluationSubFilter: string;
  screeningSubFilter: string;
  interviewScheduleFilter: string | null;
};

export function useFilteredApplicants({
  applicants,
  activeStage,
  interviewSubFilter,
  evaluationSubFilter,
  screeningSubFilter,
  interviewScheduleFilter,
}: UseFilteredApplicantsArgs): Applicant[] {
  return useMemo(() => {
    let filtered = applicants.filter(STAGE_FILTER_MAP[activeStage]);

    if (activeStage === "interview") {
      filtered = filtered.filter(INTERVIEW_SUB_FILTER_MAP[interviewSubFilter]);
      if (interviewScheduleFilter) {
        filtered = filtered.filter(INTERVIEW_SUB_FILTER_MAP[interviewScheduleFilter]);
      }
    }

    if (activeStage === "evaluation") {
      filtered = filtered.filter(EVALUATION_SUB_FILTER_MAP[evaluationSubFilter] ?? (() => true));
    }

    if (activeStage === "screening") {
      filtered = filtered.filter(SCREENING_SUB_FILTER_MAP[screeningSubFilter]);
    }

    return filtered;
  }, [applicants, activeStage, interviewSubFilter, evaluationSubFilter, screeningSubFilter, interviewScheduleFilter]);
}
