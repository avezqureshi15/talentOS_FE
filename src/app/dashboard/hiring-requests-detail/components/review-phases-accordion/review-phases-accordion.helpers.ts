import type { ReviewAnswerPhase } from "@/services/applications/applications.types";
import type { ReviewPhase } from "./review-phases-accordion.types";

export const REVIEW_PHASE_MAX_SCORE = 5;

export type ScoreTone = "high" | "mid" | "low";

/**
 * Map a score onto high / mid / low relative to maxScore.
 * For max=5: 5 → high (green), 3–4 → mid (yellow), 1–2 → low (red).
 * Averages use nearest integer band so 4.5 reads as high.
 */
export function scoreTone(score: number, maxScore = REVIEW_PHASE_MAX_SCORE): ScoreTone {
  if (!Number.isFinite(score) || maxScore <= 0) return "low";
  const band = Math.min(maxScore, Math.max(1, Math.round(score)));
  const midFloor = Math.ceil(maxScore * 0.6); // 3 when maxScore is 5
  if (band >= maxScore) return "high";
  if (band >= midFloor) return "mid";
  return "low";
}

function isAnswerItem(value: unknown): value is { question: string; score: number; notes?: string | null } {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.question === "string"
    && item.question.trim().length > 0
    && typeof item.score === "number"
    && Number.isFinite(item.score);
}

function isPhaseItem(value: unknown): value is ReviewAnswerPhase {
  if (!value || typeof value !== "object") return false;
  const phase = value as Record<string, unknown>;
  return typeof phase.phase === "string"
    && phase.phase.trim().length > 0
    && Array.isArray(phase.answers);
}

/** Normalize API/panel phase payloads into accordion-ready phases. */
export function normalizeReviewPhases(raw: unknown): ReviewPhase[] {
  if (!Array.isArray(raw)) return [];

  const phases: ReviewPhase[] = [];
  for (const item of raw) {
    if (!isPhaseItem(item)) continue;
    const answers = item.answers
      .filter(isAnswerItem)
      .map((answer) => ({
        question: answer.question.trim(),
        score: answer.score,
        notes: typeof answer.notes === "string" && answer.notes.trim()
          ? answer.notes.trim()
          : null,
      }));
    if (answers.length === 0) continue;
    phases.push({
      phase: item.phase.trim(),
      answers,
    });
  }
  return phases;
}

export function phaseAverageScore(answers: { score: number }[]): number | null {
  if (answers.length === 0) return null;
  const total = answers.reduce((sum, answer) => sum + answer.score, 0);
  return Math.round((total / answers.length) * 10) / 10;
}

export function overallAverageScore(
  phases: ReviewPhase[],
  averageRating?: number,
): number | null {
  if (typeof averageRating === "number" && Number.isFinite(averageRating)) {
    return Math.round(averageRating * 10) / 10;
  }
  const scores = phases.flatMap((phase) => phase.answers.map((answer) => answer.score));
  if (scores.length === 0) return null;
  return Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 10) / 10;
}

export function formatScoreLabel(score: number, maxScore = REVIEW_PHASE_MAX_SCORE): string {
  const display = Number.isInteger(score) ? String(score) : score.toFixed(1);
  return `${display}/${maxScore}`;
}
