export const ATS_SCORE_STAGE = "resume-shortlisting";

export function canShowAtsScore(
  stage: string | undefined,
  score: number | null | undefined,
): score is number {
  return stage === ATS_SCORE_STAGE && score != null;
}

export function atsScoreClass(score: number): string {
  if (score >= 70) return "score-high";
  if (score >= 40) return "score-mid";
  return "score-low";
}
