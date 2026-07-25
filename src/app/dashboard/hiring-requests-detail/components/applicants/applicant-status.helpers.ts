import { resolveInterviewPhase } from "./interview-phase.helpers";
import type { ActiveInterview } from "./interview-phase.helpers";
import type { ApplicantStatus, ChipConfig, HiringState } from "./applicants.types";

/** Normalize API / override status keys for comparison. */
export function normalizeApplicantStatus(status: string | null | undefined): string {
  return (status ?? "").toLowerCase().replace(/-/g, "_");
}

const POST_INTERVIEW_STATUSES = new Set([
  "waiting_for_review",
  "interview_cancelled",
]);

const FINALISH_STATUSES = new Set([
  "rejected",
  "moved_out_of_hiring_pipeline",
  "invalid",
  "failed",
]);

const BOOKING_OPTIMISTIC = new Set([
  "scheduled",
  "interview_scheduled",
  "interview_rescheduled",
]);

const BOOKING_CAUGHT_UP = new Set([
  "scheduled",
  "interview_scheduled",
  "interview_rescheduled",
  "waiting_for_review",
  "interview_cancelled",
  "rejected",
  "moved_out_of_hiring_pipeline",
]);

const SHORTLIST_OPTIMISTIC = new Set(["shortlisted"]);

const PAST_SHORTLIST = new Set([
  "move_to_next_round",
  "scheduled",
  "interview_scheduled",
  "interview_rescheduled",
  "waiting_for_review",
  "interview_cancelled",
  "rejected",
  "moved_out_of_hiring_pipeline",
]);

const INTERVIEW_FAMILY_HIRING: ReadonlySet<HiringState> = new Set([
  "interview_scheduled",
  "interview_rescheduled",
]);

const INTERVIEW_IN_PROGRESS_CHIP: ChipConfig = {
  label: "Interview in progress",
  variant: "info",
};

/**
 * Prefer server status once it has advanced past an optimistic local override.
 * Keeps local only while the list refresh has not caught up yet.
 */
export function resolveDisplayStatus(
  serverStatus: ApplicantStatus | undefined,
  localStatus: ApplicantStatus | undefined,
): ApplicantStatus | undefined {
  if (!localStatus) return serverStatus;
  if (!serverStatus) return localStatus;

  const server = normalizeApplicantStatus(serverStatus);
  const local = normalizeApplicantStatus(localStatus);

  if (server === local) return serverStatus;

  if (POST_INTERVIEW_STATUSES.has(server) || FINALISH_STATUSES.has(server)) {
    return serverStatus;
  }

  if (BOOKING_OPTIMISTIC.has(local) && BOOKING_CAUGHT_UP.has(server)) {
    return serverStatus;
  }

  if (SHORTLIST_OPTIMISTIC.has(local) && PAST_SHORTLIST.has(server)) {
    return serverStatus;
  }

  if (local === "rejected" && (FINALISH_STATUSES.has(server) || server === "rejected")) {
    return serverStatus;
  }

  return localStatus;
}

/** Phase may refine scheduled/rescheduled chips only — never post-interview states. */
export function resolveChipForHiringState(
  hiringState: HiringState,
  baseChip: ChipConfig,
  activeInterview: ActiveInterview | null | undefined,
): ChipConfig {
  if (!INTERVIEW_FAMILY_HIRING.has(hiringState)) {
    return baseChip;
  }

  const phase = resolveInterviewPhase(activeInterview);
  if (phase === "in_progress") {
    return INTERVIEW_IN_PROGRESS_CHIP;
  }

  return baseChip;
}

/** Reschedule only while still in the interview-scheduled family and start is upcoming. */
export function canShowReschedule(params: {
  status?: string;
  activeInterview?: ActiveInterview | null;
}): boolean {
  const status = normalizeApplicantStatus(params.status);
  if (!BOOKING_OPTIMISTIC.has(status)) return false;
  return resolveInterviewPhase(params.activeInterview) === "upcoming";
}
