import type {
  InterviewDesignQuestion,
  InterviewDesignSection,
} from "@/services/questions/questions.types";

export type { InterviewSectionType } from "@/services/questions/questions.types";

export type InterviewPlanQuestion = InterviewDesignQuestion;

export type InterviewPlanSection = InterviewDesignSection;

export interface InterviewPlan {
  sections: InterviewPlanSection[];
}

export type InterviewTimeStatus = "ok" | "warning" | "danger";

export type PlannerSection = InterviewPlanSection & { minutes: number };

export type PlanKind = "interview" | "screening" | "review";
