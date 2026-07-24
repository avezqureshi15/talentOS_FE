import type { ReviewEntity, ReviewPhase, ReviewPhaseAnswer } from "./rounds-side-panel.types";

export type ResolvedAverage = {
  value: number;
  maxScore: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseAnswer(raw: unknown): ReviewPhaseAnswer | null {
  if (!isRecord(raw)) return null;
  const question = typeof raw.question === "string" ? raw.question.trim() : "";
  const score = typeof raw.score === "number" ? raw.score : Number(raw.score);
  if (!question || !Number.isFinite(score)) return null;
  const notes =
    typeof raw.notes === "string"
      ? raw.notes
      : raw.notes == null
        ? null
        : String(raw.notes);
  return { question, score, notes };
}

/** Safely parse phased review answers from API extras. */
export function parsePhases(raw: unknown): ReviewPhase[] {
  if (!Array.isArray(raw)) return [];
  const phases: ReviewPhase[] = [];
  for (const item of raw) {
    if (!isRecord(item)) continue;
    const phase = typeof item.phase === "string" ? item.phase.trim() : "";
    if (!phase || !Array.isArray(item.answers)) continue;
    const answers = item.answers
      .map(parseAnswer)
      .filter((a): a is ReviewPhaseAnswer => a !== null);
    if (answers.length === 0) continue;
    phases.push({ phase, answers });
  }
  return phases;
}

/** Prefer stored average_rating, else mean of ratings / phase scores. */
export function resolveAverage(entity: ReviewEntity): ResolvedAverage | null {
  if (typeof entity.averageRating === "number" && Number.isFinite(entity.averageRating)) {
    return { value: entity.averageRating, maxScore: 5 };
  }

  if (entity.ratings.length > 0) {
    const sum = entity.ratings.reduce((acc, r) => acc + r.score, 0);
    return {
      value: sum / entity.ratings.length,
      maxScore: entity.ratings[0].maxScore,
    };
  }

  const phaseScores = entity.phases.flatMap((p) => p.answers.map((a) => a.score));
  if (phaseScores.length > 0) {
    const sum = phaseScores.reduce((acc, s) => acc + s, 0);
    return { value: sum / phaseScores.length, maxScore: 5 };
  }

  return null;
}

export function hasFullReviewContent(entity: ReviewEntity): boolean {
  return entity.phases.length > 0 || entity.ratings.length > 0;
}

export function hasDecisionSummary(entity: ReviewEntity): boolean {
  return Boolean(
    entity.verdict ||
      entity.skills.length > 0 ||
      resolveAverage(entity) ||
      hasFullReviewContent(entity),
  );
}
