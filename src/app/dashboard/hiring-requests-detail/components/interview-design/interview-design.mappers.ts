import {
  DEFAULT_QUESTION_MINUTES,
  DEFAULT_QUESTION_SCORE,
  DEFAULT_SCREENING_MINUTES,
  DEFAULT_SECTION_DEPTH,
  DEFAULT_SECTION_TITLE,
} from "./interview-design.constants";
import type { InterviewPlanQuestion, InterviewPlanSection, PlanKind } from "./interview-design.types";

export const createQuestion = (kind: PlanKind): InterviewPlanQuestion => ({
  id: crypto.randomUUID(),
  question: "",
  score: DEFAULT_QUESTION_SCORE,
  timeAllocationMinutes:
    kind === "screening" ? DEFAULT_SCREENING_MINUTES : DEFAULT_QUESTION_MINUTES,
});

export const createSection = (): InterviewPlanSection => ({
  id: crypto.randomUUID(),
  title: DEFAULT_SECTION_TITLE,
  type: "CUSTOM",
  description: "",
  depth: DEFAULT_SECTION_DEPTH,
  questions: [],
});
