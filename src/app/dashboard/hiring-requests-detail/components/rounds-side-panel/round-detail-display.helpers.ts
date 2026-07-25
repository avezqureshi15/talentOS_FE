import type { RoundDetail, RoundInfoRow } from "./rounds-side-panel.types";
import {
  ROUNDS_PANEL_LABELS,
  INTERVIEW_STATUS_LABELS,
  REVIEW_FORM_STATUS_LABELS,
  COMPLETED_WITH_REVIEW_LABELS,
} from "./rounds-side-panel.constants";

export function resolveReviewStatusLabel(reviewFormStatus: string | null | undefined): string {
  if (!reviewFormStatus) return "";
  return REVIEW_FORM_STATUS_LABELS[reviewFormStatus] ?? "";
}

/** Map BE interview status (+ optional form status for completed) to a clear UI label. */
export function resolveInterviewPhaseLabel(
  status: string,
  reviewFormStatus: string | null | undefined,
): string {
  const trimmed = (status || "").trim();
  if (!trimmed) return "";

  if (trimmed === "Completed" && reviewFormStatus) {
    return COMPLETED_WITH_REVIEW_LABELS[reviewFormStatus] ?? INTERVIEW_STATUS_LABELS.Completed;
  }

  return INTERVIEW_STATUS_LABELS[trimmed] ?? trimmed;
}

function interviewerDisplay(round: RoundDetail): string {
  if (round.interviewers.length > 0) return round.interviewers.join(", ");
  return round.interviewer;
}

export function buildRoundInfoRows(round: RoundDetail): RoundInfoRow[] {
  if (round.hasInterview) {
    const rows: RoundInfoRow[] = [
      { label: ROUNDS_PANEL_LABELS.INTERVIEWERS, icon: "bx bx-user", value: interviewerDisplay(round) },
      { label: ROUNDS_PANEL_LABELS.CANDIDATE, icon: "bx bx-user-voice", value: round.candidate },
      { label: ROUNDS_PANEL_LABELS.HIRING_ROLE, icon: "bx bx-briefcase", value: round.role },
      { label: ROUNDS_PANEL_LABELS.SCHEDULED_FOR, icon: "bx bx-calendar", value: round.slot },
      { label: ROUNDS_PANEL_LABELS.DURATION, icon: "bx bx-stopwatch", value: round.duration },
      {
        label: ROUNDS_PANEL_LABELS.INTERVIEW_STATUS,
        icon: "bx bx-check-circle",
        value: resolveInterviewPhaseLabel(round.status, round.reviewFormStatus),
      },
    ];

    const reviewLabel = resolveReviewStatusLabel(round.reviewFormStatus);
    if (reviewLabel) {
      rows.push({
        label: ROUNDS_PANEL_LABELS.REVIEW_STATUS,
        icon: "bx bx-clipboard",
        value: reviewLabel,
      });
    }

    return rows;
  }

  return [
    { label: ROUNDS_PANEL_LABELS.CANDIDATE, icon: "bx bx-user-voice", value: round.candidate },
    { label: ROUNDS_PANEL_LABELS.HIRING_ROLE, icon: "bx bx-briefcase", value: round.role },
    { label: ROUNDS_PANEL_LABELS.SCREENED_ON, icon: "bx bx-calendar", value: round.occurredOn },
    { label: ROUNDS_PANEL_LABELS.STATUS, icon: "bx bx-check-circle", value: round.status },
  ];
}
