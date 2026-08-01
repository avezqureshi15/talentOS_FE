import type { InterviewSectionType } from "./interview-design.types";

export const TARGET_INTERVIEW_MINUTES = 45;

export const SCREENING_TARGET_MINUTES = 15;

export const WARNING_THRESHOLD_FACTOR = 0.8;

export const DEFAULT_QUESTION_MINUTES = 5;

export const DEFAULT_SCREENING_MINUTES = 1;

export const DEFAULT_QUESTION_SCORE = 5;

export const MIN_QUESTION_MINUTES = 1;

export const MAX_QUESTION_MINUTES = 60;

export const SCREENING_MAX_QUESTION_MINUTES = 2;

export const MIN_QUESTION_SCORE = 1;

export const MAX_QUESTION_SCORE = 10;

export const DEFAULT_SECTION_TITLE = "New Section";

export const DEFAULT_SECTION_TYPE: InterviewSectionType = "CUSTOM";

export const DEFAULT_SECTION_DEPTH = "Standard";

export const SECTION_TYPE_OPTIONS: readonly InterviewSectionType[] = [
  "INTRO",
  "Q&A",
  "SYSTEM DESIGN",
  "SCENARIO",
  "CLOSING",
  "CUSTOM",
];

export const SECTION_DEPTH_OPTIONS: readonly string[] = ["Standard", "Deep Dive"];
