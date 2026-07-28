import type { StageKey } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.types";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

export const DEFAULT_FILTER = "all";

export const STAGE_FILTER_MAP: Record<StageKey, (a: Applicant) => boolean> = {
  "resume-shortlisting": (a) => a.stage === "RESUME_SHORTLISTING" || a.stage === "RESUME_SHORTLISTED",
  screening: (a) => a.stage === "SCREENING" || a.stage === "AI_SCREENING",
  interview: (a) =>
    (a.stage === "INTERVIEW" || a.stage === "AI_INTERVIEW") &&
    ["interview_scheduled", "interview_rescheduled", "interview_cancelled"].includes(a.status?.toLowerCase() ?? ""),
  "waiting-evaluation": (a) => a.stage === "WAITING_FOR_EVALUATION" || a.status?.toLowerCase() === "waiting_for_review",
  evaluated: (a) => (a.stage === "INTERVIEW" || a.stage === "AI_INTERVIEW") && a.status?.toLowerCase() === "under_evaluation",
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
  "yet-to-start": (a) =>
    a.status?.toLowerCase() === "interview_scheduled" ||
    a.status?.toLowerCase() === "interview_rescheduled",
  "no-show": (a) => a.status?.toLowerCase() === "interview_cancelled",
};

export const EVALUATED_SUB_FILTER_MAP: Record<string, (a: Applicant) => boolean> = {
  ai: (a) => a.stage === "AI_INTERVIEW" && a.status?.toLowerCase() === "under_evaluation",
  regular: (a) => a.stage === "INTERVIEW" && a.status?.toLowerCase() === "under_evaluation",
};
export const UI_TABLE_VIEW = "Overview";

export const UI_CARD_VIEW = "Profile View";
export const UI_INTERVIEW_YET_TO_START = "Yet to Start";
export const UI_INTERVIEW_NO_SHOW = "No Show";
export const UI_EVALUATED_AI = "AI";
export const UI_EVALUATED_REGULAR = "Regular";
export const UI_SEARCHING_APPLICANT = "Searching for applicant across pages...";
export const UI_APPLICANT_NOT_FOUND = "Applicant not found in this hiring request.";
