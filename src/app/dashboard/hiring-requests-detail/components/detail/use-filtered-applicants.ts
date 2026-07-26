import { useMemo } from "react";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";
import type { StageKey } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.types";
import { STAGE_FILTER_MAP, SCORE_FILTER_MAP, INTERVIEW_SUB_FILTER_MAP, EVALUATED_SUB_FILTER_MAP } from "./detail.constants";

type UseFilteredApplicantsArgs = {
  applicants: Applicant[];
  activeStage: StageKey;
  scoreFilter: string;
  rejectReason: string;
  interviewSubFilter: string;
  evaluatedSubFilter: string;
};

export function useFilteredApplicants({
  applicants,
  activeStage,
  scoreFilter,
  rejectReason,
  interviewSubFilter,
  evaluatedSubFilter,
}: UseFilteredApplicantsArgs): Applicant[] {
  return useMemo(() => {
    let filtered = applicants.filter(STAGE_FILTER_MAP[activeStage]);

    const scoreRange = SCORE_FILTER_MAP[scoreFilter] ?? {};
    if (scoreRange.min != null) filtered = filtered.filter((a) => (a.score ?? 0) >= scoreRange.min!);
    if (scoreRange.max != null) filtered = filtered.filter((a) => (a.score ?? 0) <= scoreRange.max!);

    if (rejectReason) {
      const reasons = rejectReason.split(",");
      filtered = filtered.filter((a) => reasons.some((r) => a.status?.includes(r)));
    }

    if (activeStage === "interview") {
      filtered = filtered.filter(INTERVIEW_SUB_FILTER_MAP[interviewSubFilter]);
    }

    if (activeStage === "evaluated") {
      filtered = filtered.filter(EVALUATED_SUB_FILTER_MAP[evaluatedSubFilter]);
    }

    return filtered;
  }, [applicants, activeStage, interviewSubFilter, evaluatedSubFilter, scoreFilter, rejectReason]);
}
