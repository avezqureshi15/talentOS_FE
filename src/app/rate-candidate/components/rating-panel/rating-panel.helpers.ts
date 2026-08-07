import type { AnswerMap, ReviewQuestionsData } from "@/app/rate-candidate/services/rate-candidate.types";
import { RATING_CRITERIA } from "@/app/rate-candidate/components/rating-panel/rating-panel.constants";

export const STATIC_REVIEW_QUESTIONS: ReviewQuestionsData = {
  format: "phases",
  questions_source: "static",
  phases: [
    {
      phase: "Overall",
      questions: RATING_CRITERIA.map((c) => c.label),
    },
  ],
};

export function answerKey(groupIndex: number, questionIndex: number): string {
  return `${groupIndex}:${questionIndex}`;
}

export function buildEmptyAnswers(data: ReviewQuestionsData): AnswerMap {
  const answers: AnswerMap = {};
  if (data.format === "sections") {
    data.sections.forEach((sec, si) => {
      sec.questions.forEach((_, qi) => {
        answers[answerKey(si, qi)] = { score: 0, notes: "" };
      });
    });
  } else {
    data.phases.forEach((phase, pi) => {
      phase.questions.forEach((_, qi) => {
        answers[answerKey(pi, qi)] = { score: 0, notes: "" };
      });
    });
  }
  return answers;
}

export function allQuestionsScored(data: ReviewQuestionsData, answers: AnswerMap): boolean {
  if (data.format === "sections") {
    let hasQuestions = false;
    for (let si = 0; si < data.sections.length; si++) {
      for (let qi = 0; qi < data.sections[si].questions.length; qi++) {
        hasQuestions = true;
        const score = answers[answerKey(si, qi)]?.score ?? 0;
        if (score < 1 || score > 5) return false;
      }
    }
    return hasQuestions;
  }
  for (let pi = 0; pi < data.phases.length; pi++) {
    for (let qi = 0; qi < data.phases[pi].questions.length; qi++) {
      const score = answers[answerKey(pi, qi)]?.score ?? 0;
      if (score < 1 || score > 5) return false;
    }
  }
  return data.phases.some((p) => p.questions.length > 0);
}

export function averageScore(answers: AnswerMap): number {
  const scores = Object.values(answers)
    .map((a) => a.score)
    .filter((s) => s >= 1 && s <= 5);
  if (scores.length === 0) return 0;
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
}

export function buildInterviewerReviewsPayload(
  data: ReviewQuestionsData,
  answers: AnswerMap,
  skills: string[],
) {
  if (data.format === "sections") {
    return {
      questions_source: data.questions_source,
      sections: data.sections.map((sec, si) => ({
        section: sec.section,
        answers: sec.questions.map((q, qi) => {
          const answer = answers[answerKey(si, qi)] ?? { score: 0, notes: "" };
          const notes = answer.notes.trim();
          return { question: q.question, score: answer.score, notes: notes || null };
        }),
      })),
      average_rating: averageScore(answers),
      skills,
    };
  }
  return {
    questions_source: data.questions_source,
    phases: data.phases.map((phase, pi) => ({
      phase: phase.phase,
      answers: phase.questions.map((question, qi) => {
        const answer = answers[answerKey(pi, qi)] ?? { score: 0, notes: "" };
        const notes = answer.notes.trim();
        return { question, score: answer.score, notes: notes || null };
      }),
    })),
    average_rating: averageScore(answers),
    skills,
  };
}

export function questionsKey(data: ReviewQuestionsData): string {
  if (data.format === "sections") {
    return data.sections
      .map((s) => `${s.section}:${s.questions.map((q) => q.question).join("|")}`)
      .join("||");
  }
  return data.phases.map((p) => `${p.phase}:${p.questions.join("|")}`).join("||");
}
