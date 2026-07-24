import { VERDICT_CONFIG, VERDICT_CHIP_VARIANT, ROUNDS_TAB_LABELS } from "./card-rounds-tab.constants";
import {
  CURRENT_ROUND_LABEL,
  LAST_ROUND_LABEL,
} from "./applicants.constants";
import { normalizeApplicantStatus } from "./applicant-status.helpers";
import type { ActiveInterview } from "./interview-phase.helpers";
import type { ChipVariant } from "@/components/ui/chip/chip.types";

/** Display-only fallback when a round was saved without a real name. */
export const UNTITLED_ROUND_NAME = "Untitled Round";

/**
 * Only these statuses mean the pointed round is done and booking hasn't started.
 * Interview scheduled / in progress / review must stay "Current round".
 */
const BETWEEN_ROUNDS_FOR_LAST_LABEL = new Set([
  "shortlisted",
  "move_to_next_round",
]);

/** Inputs for Round Details link label (pipeline vs closed decision). */
export type RoundLinkLabelInput = {
  status?: string | null;
  activeInterview?: ActiveInterview | null;
  /** Candidate has a closed hire decision (selected / rejected). */
  hasFinalVerdict?: boolean;
  /** Archive surfaces such as Final Verdict (read-only cards). */
  closedPipelineView?: boolean;
};

/** True when a final hiring decision is present on the applicant. */
export function hasClosedFinalVerdict(
  finalVerdict: string | null | undefined,
): boolean {
  return Boolean(finalVerdict?.trim());
}

/**
 * Link label for Round Details entry.
 * Closed decisions / archive views → Last round.
 * Active pipeline → Current round, except between-rounds statuses.
 */
export function resolveRoundLinkLabel(input: RoundLinkLabelInput): string {
  if (input.hasFinalVerdict || input.closedPipelineView) {
    return LAST_ROUND_LABEL;
  }

  if (input.activeInterview) return CURRENT_ROUND_LABEL;

  const key = normalizeApplicantStatus(input.status);
  if (BETWEEN_ROUNDS_FOR_LAST_LABEL.has(key)) return LAST_ROUND_LABEL;

  return CURRENT_ROUND_LABEL;
}

const UNTITLED_ALIASES = new Set(["", UNTITLED_ROUND_NAME.toLowerCase()]);

/** Human-readable round title for UI (does not rename stored data). */
export function displayRoundName(name: string | null | undefined): string {
  const trimmed = (name ?? "").trim();
  if (UNTITLED_ALIASES.has(trimmed.toLowerCase())) return "Interview";
  return trimmed;
}

export type RoundListItem = {
  id: string;
  round: string;
  roundVerdict: string | null;
  createdAt?: string;
};

/** Prefer currentRoundId; else latest by createdAt (or last list item). */
export function resolveLastRoundId(
  currentRoundId: string | null | undefined,
  rounds: Array<{ id: string; createdAt?: string }> | null | undefined,
): string | null {
  if (currentRoundId) return currentRoundId;
  if (!rounds?.length) return null;

  const withDates = rounds.filter((r) => r.createdAt);
  if (withDates.length > 0) {
    const sorted = [...withDates].sort(
      (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime(),
    );
    return sorted[0]?.id ?? null;
  }

  return rounds[rounds.length - 1]?.id ?? null;
}

export type RoundDecisionResult = {
  text: string;
  chipVariant: ChipVariant;
};

/**
 * Decision pill for Rounds tab.
 * Uses round_verdict when set; else reviewVerdict when this row is the current round.
 */
export function resolveRoundDecision(params: {
  roundId: string;
  roundVerdict: string | null;
  currentRoundId?: string | null;
  reviewVerdict?: string | null;
}): RoundDecisionResult {
  const { roundId, roundVerdict, currentRoundId, reviewVerdict } = params;

  if (roundVerdict) {
    const key = roundVerdict.toLowerCase();
    return {
      text: VERDICT_CONFIG[key] ?? roundVerdict,
      chipVariant: (VERDICT_CHIP_VARIANT[key] ?? "neutral") as ChipVariant,
    };
  }

  if (currentRoundId && roundId === currentRoundId && reviewVerdict) {
    const key = reviewVerdict.toLowerCase();
    return {
      text: VERDICT_CONFIG[key] ?? reviewVerdict,
      chipVariant: (VERDICT_CHIP_VARIANT[key] ?? "neutral") as ChipVariant,
    };
  }

  return {
    text: ROUNDS_TAB_LABELS.NO_VERDICT,
    chipVariant: "neutral",
  };
}
