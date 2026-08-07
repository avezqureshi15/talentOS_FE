import type { StageKey } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.types";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";
import { STAGE_TO_BACKEND_STAGE } from "@/app/dashboard/hiring-requests-detail/components/applicants/fsm.constants";

export const DEFAULT_FILTER = "all";

function includesStage(a: Applicant, stageKey: StageKey): boolean {
  return STAGE_TO_BACKEND_STAGE[stageKey].includes(a.stage ?? "");
}

export const STAGE_FILTER_MAP: Record<StageKey, (a: Applicant) => boolean> = {
  "resume-shortlisting": (a) => includesStage(a, "resume-shortlisting"),
  screening: (a) => includesStage(a, "screening"),
  interview: (a) =>
    includesStage(a, "interview") &&
    ["interview_scheduled", "interview_rescheduled", "interview_cancelled"].includes(a.status?.toLowerCase() ?? ""),
  "waiting-evaluation": (a) =>
    includesStage(a, "waiting-evaluation") ||
    a.status?.toLowerCase() === "waiting_for_review",
  evaluated: (a) =>
    includesStage(a, "evaluated") &&
    a.status?.toLowerCase() === "under_evaluation",
  selected: () => false,
  rejected: () => false,
  "on-hold": () => false,
};

export const SCORE_FILTER_MAP: Record<string, { min?: number; max?: number }> = {
  all: {},
  gte80: { min: 80 },
  gte70: { min: 70 },
  gte50: { min: 50 },
  lt50: { max: 49 },
  lt30: { max: 29 },
};

export const INTERVIEW_SUB_FILTER_MAP: Record<string, (a: Applicant) => boolean> = {
  "ai-incoming": (a) =>
    a.stage === "AI_INTERVIEW" &&
    (a.status?.toLowerCase() === "interview_scheduled" ||
     a.status?.toLowerCase() === "interview_rescheduled"),
  "regular-incoming": (a) =>
    a.stage === "INTERVIEW" &&
    (a.status?.toLowerCase() === "interview_scheduled" ||
     a.status?.toLowerCase() === "interview_rescheduled"),
  "no-show": (a) => a.status?.toLowerCase() === "interview_cancelled",
};

export const EVALUATED_SUB_FILTER_MAP: Record<string, (a: Applicant) => boolean> = {
  ai: (a) => a.stage === "AI_INTERVIEW" && a.status?.toLowerCase() === "under_evaluation",
  regular: (a) => a.stage === "INTERVIEW" && a.status?.toLowerCase() === "under_evaluation",
};

export const SCREENING_SUB_FILTER_MAP: Record<string, (a: Applicant) => boolean> = {
  pending: (a) =>
    a.status?.toLowerCase() === "shortlisted" ||
    a.status?.toLowerCase() === "move_to_next_round" ||
    a.status?.toLowerCase() === "screening_round_scheduled",
  completed: (a) => a.status?.toLowerCase() === "under_evaluation",
  flagged: (a) =>
    a.status?.toLowerCase() === "ai_screening_evaluation_failed" ||
    a.status?.toLowerCase() === "ai_screening_flagged",
};

export const UI_TABLE_VIEW = "Overview";

export const UI_CARD_VIEW = "Profile View";
export const UI_INTERVIEW_AI_INCOMING = "AI Incoming";
export const UI_INTERVIEW_REGULAR_INCOMING = "Regular Incoming";
export const UI_INTERVIEW_NO_SHOW = "No Show";
export const UI_EVALUATED_AI = "AI";
export const UI_EVALUATED_REGULAR = "Regular";
export const UI_SCREENING_PENDING = "Pending";
export const UI_SCREENING_COMPLETED = "Completed";
export const UI_SCREENING_FLAGGED = "Flagged";
export const UI_SEARCHING_APPLICANT = "Searching for applicant across pages...";
export const UI_APPLICANT_NOT_FOUND = "Applicant not found in this hiring request.";
