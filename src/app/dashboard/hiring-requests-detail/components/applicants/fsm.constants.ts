import type { StageKey } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.types";
import type { HiringState, ApplicantStatus, Applicant } from "./applicants.types";
import type { Transition } from "./fsm.types";

export const STAGE_TO_BACKEND_STAGE: Record<StageKey, readonly string[]> = {
  "resume-shortlisting": ["RESUME_SHORTLISTING", "RESUME_SHORTLISTED"],
  screening: ["SCREENING", "AI_SCREENING"],
  interview: ["INTERVIEW", "AI_INTERVIEW"],
  "waiting-evaluation": ["WAITING_FOR_EVALUATION"],
  evaluated: ["INTERVIEW", "AI_INTERVIEW"],
  selected: [],
  rejected: [],
  "on-hold": [],
};

export const HIRING_STATE_TO_PIPELINE_STAGE: Record<HiringState, StageKey> = {
  waiting_for_review: "waiting-evaluation",
  under_evaluation: "evaluated",
  shortlisted: "screening",
  move_to_next_round: "screening",
  interview_scheduled: "interview",
  interview_rescheduled: "interview",
  interview_cancelled: "interview",
  ongoing: "interview",
  no_show: "interview",
  screening_round_scheduled: "screening",
  ai_screening_evaluation_failed: "screening",
  ai_screening_flagged: "screening",
  rejected: "rejected",
  selected: "selected",
  "on-hold": "on-hold",
};

export const STAGE_TO_HIRING_STATES: Record<StageKey, readonly HiringState[]> = {
  "resume-shortlisting": [],
  screening: ["shortlisted", "move_to_next_round", "screening_round_scheduled", "ai_screening_evaluation_failed", "ai_screening_flagged"],
  interview: ["interview_scheduled", "interview_rescheduled", "interview_cancelled", "ongoing", "no_show"],
  "waiting-evaluation": ["waiting_for_review"],
  evaluated: ["under_evaluation"],
  selected: ["selected"],
  rejected: ["rejected"],
  "on-hold": ["on-hold"],
};

export const TRANSITIONS: Transition[] = [
  {
    action: "onShortlist",
    from: ["under_evaluation"] as const,
    to: "shortlisted",
    optimistic: (): Partial<{ status: ApplicantStatus; finalVerdict: string }> => ({
      status: "shortlisted",
    }),
  },
  {
    action: "onRejectFromEvaluation",
    from: ["under_evaluation", "ai_screening_flagged"] as const,
    to: "rejected",
    optimistic: (): Partial<{ status: ApplicantStatus; finalVerdict: string }> => ({
      status: "rejected",
      finalVerdict: "rejected",
    }),
  },
  {
    action: "onMoveToNextRound",
    from: ["shortlisted"] as const,
    to: "move_to_next_round",
  },
  {
    action: "onScheduleInterview",
    from: ["move_to_next_round"] as const,
    to: "interview_scheduled",
    optimistic: (): Partial<{ status: ApplicantStatus; finalVerdict: string }> => ({
      status: "scheduled",
    }),
  },
  {
    action: "onRescheduleInterview",
    from: ["interview_scheduled", "interview_rescheduled"] as const,
    to: "interview_rescheduled",
  },
  {
    action: "onCancelInterview",
    from: ["interview_scheduled", "interview_rescheduled", "screening_round_scheduled"] as const,
    to: "interview_cancelled",
    optimistic: (): Partial<{ status: ApplicantStatus; finalVerdict: string }> => ({
      status: "interview_cancelled",
    }),
  },
  {
    action: "onMoveToScreening",
    from: "*",
    to: "under_evaluation",
    optimistic: (): Partial<{ status: ApplicantStatus; finalVerdict: string }> => ({
      status: "under_evaluation",
    }),
  },
  {
    action: "onMenuSelect",
    from: "*",
    to: "selected",
    optimistic: (): Partial<{ status: ApplicantStatus; finalVerdict: string }> => ({
      finalVerdict: "selected",
    }),
  },
  {
    action: "onMenuReject",
    from: "*",
    to: "rejected",
    optimistic: (): Partial<{ status: ApplicantStatus; finalVerdict: string }> => ({
      finalVerdict: "rejected",
    }),
  },
  {
    action: "onMenuHold",
    from: "*",
    to: "on-hold",
    optimistic: (): Partial<{ status: ApplicantStatus; finalVerdict: string }> => ({
      finalVerdict: "on-hold",
    }),
  },
];

export function includesStage(a: Applicant, stageKey: StageKey): boolean {
  return STAGE_TO_BACKEND_STAGE[stageKey].includes(a.stage ?? "");
}

export function getTransition(
  action: string,
  currentState: HiringState,
): Transition | undefined {
  return TRANSITIONS.find(
    (t) =>
      t.action === action &&
      (t.from === "*" || t.from.includes(currentState)),
  );
}
