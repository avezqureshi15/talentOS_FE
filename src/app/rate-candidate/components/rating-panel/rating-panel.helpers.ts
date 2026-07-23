import type { AnswerMap, ReviewPhase, ReviewSubmitRequest } from "@/app/rate-candidate/services/rate-candidate.types";
import { RATING_CRITERIA } from "@/app/rate-candidate/components/rating-panel/rating-panel.constants";

export const STATIC_REVIEW_QUESTIONS = {
  questions_source: "static",
  phases: [
    {
      phase: "Overall",
      questions: RATING_CRITERIA.map((c) => c.label),
    },
  ],
} as const;

export function answerKey(phaseIndex: number, questionIndex: number): string {
  return `${phaseIndex}:${questionIndex}`;
}

export function buildEmptyAnswers(phases: ReviewPhase[]): AnswerMap {
  const answers: AnswerMap = {};
  phases.forEach((phase, pi) => {
    phase.questions.forEach((_, qi) => {
      answers[answerKey(pi, qi)] = { score: 0, notes: "" };
    });
  });
  return answers;
}

export function allQuestionsScored(phases: ReviewPhase[], answers: AnswerMap): boolean {
  for (let pi = 0; pi < phases.length; pi++) {
    for (let qi = 0; qi < phases[pi].questions.length; qi++) {
      const score = answers[answerKey(pi, qi)]?.score ?? 0;
      if (score < 1 || score > 5) return false;
    }
  }
  return phases.some((p) => p.questions.length > 0);
}

export function averageScore(answers: AnswerMap): number {
  const scores = Object.values(answers)
    .map((a) => a.score)
    .filter((s) => s >= 1 && s <= 5);
  if (scores.length === 0) return 0;
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
}

export function buildInterviewerReviewsPayload(
  questionsSource: string,
  phases: ReviewPhase[],
  answers: AnswerMap,
  skills: string[],
): ReviewSubmitRequest["reviews"] {
  return {
    questions_source: questionsSource,
    phases: phases.map((phase, pi) => ({
      phase: phase.phase,
      answers: phase.questions.map((question, qi) => {
        const answer = answers[answerKey(pi, qi)] ?? { score: 0, notes: "" };
        const notes = answer.notes.trim();
        return {
          question,
          score: answer.score,
          notes: notes.length > 0 ? notes : null,
        };
      }),
    })),
    average_rating: averageScore(answers),
    skills,
  };
}

export function phasesKey(phases: ReviewPhase[]): string {
  return phases.map((p) => `${p.phase}:${p.questions.join("|")}`).join("||");
}
