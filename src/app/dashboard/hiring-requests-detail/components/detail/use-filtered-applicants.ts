import { useMemo } from "react";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";
import type { StageKey } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.types";
import { STAGE_FILTER_MAP, INTERVIEW_SUB_FILTER_MAP, EVALUATED_SUB_FILTER_MAP } from "./detail.constants";

type UseFilteredApplicantsArgs = {
  applicants: Applicant[];
  activeStage: StageKey;
  interviewSubFilter: string;
  evaluatedSubFilter: string;
  rejectReason?: string;
};

export function useFilteredApplicants({
  applicants,
  activeStage,
  interviewSubFilter,
  evaluatedSubFilter,
  rejectReason,
}: UseFilteredApplicantsArgs): Applicant[] {
  return useMemo(() => {
    let filtered = applicants.filter(STAGE_FILTER_MAP[activeStage]);

    if (rejectReason && activeStage === "resume-shortlisting") {
      const reasons = rejectReason.split(",").filter(Boolean).map((r) => r.toUpperCase());
      filtered = filtered.filter((a) =>
        reasons.some((r) => (a.disqualifiedBy ?? []).includes(r)),
      );
    }

    if (activeStage === "interview") {
      filtered = filtered.filter(INTERVIEW_SUB_FILTER_MAP[interviewSubFilter]);
    }

    if (activeStage === "evaluated") {
      filtered = filtered.filter(EVALUATED_SUB_FILTER_MAP[evaluatedSubFilter]);
    }

    return filtered;
  }, [applicants, activeStage, interviewSubFilter, evaluatedSubFilter, rejectReason]);
}
