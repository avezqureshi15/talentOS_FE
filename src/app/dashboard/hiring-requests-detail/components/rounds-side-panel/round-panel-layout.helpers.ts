import type { RoundDetail } from "./rounds-side-panel.types";

/** Wide two-column layout only when Decisions & Reviews will render. */
export function shouldSplitRoundPanel(
  round: RoundDetail | null | undefined,
  hideReviews?: boolean,
): boolean {
  if (!round || hideReviews) return false;
  return round.reviews.length > 0;
}
