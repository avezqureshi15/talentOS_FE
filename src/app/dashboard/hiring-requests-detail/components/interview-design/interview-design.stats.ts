import {
  SCREENING_TARGET_MINUTES,
  TARGET_INTERVIEW_MINUTES,
  WARNING_THRESHOLD_FACTOR,
} from "./interview-design.constants";
import type { InterviewPlan, InterviewTimeStatus, PlanKind } from "./interview-design.types";

export const INTERVIEW_TIME_STATUS_LABEL: Record<InterviewTimeStatus, string> = {
  ok: "On track",
  warning: "Approaching limit",
  danger: "Over target",
};

export interface InterviewPlanStats {
  totalMinutes: number;
  targetMinutes: number;
  timeStatus: InterviewTimeStatus;
  questionCount: number;
}

export const computeInterviewPlanStats = (
  kind: PlanKind,
  plan: InterviewPlan,
): InterviewPlanStats => {
  const targetMinutes =
    kind === "screening" ? SCREENING_TARGET_MINUTES : TARGET_INTERVIEW_MINUTES;

  const totalMinutes = plan.sections.reduce(
    (sum, section) =>
      sum + section.questions.reduce((qSum, question) => qSum + question.timeAllocationMinutes, 0),
    0,
  );

  const timeStatus: InterviewTimeStatus =
    totalMinutes > targetMinutes
      ? "danger"
      : totalMinutes >= targetMinutes * WARNING_THRESHOLD_FACTOR
        ? "warning"
        : "ok";

  const questionCount = plan.sections.reduce((sum, section) => sum + section.questions.length, 0);

  return { totalMinutes, targetMinutes, timeStatus, questionCount };
};
