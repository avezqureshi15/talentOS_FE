import type { CandidateActionKey } from "./candidate-actions-menu.types";

type ActionMeta = {
  label: string;
  icon: string;
  variant?: "default" | "destructive";
};

export const CANDIDATE_ACTION_META: Record<CandidateActionKey, ActionMeta> = {
  view_profile: { label: "View Profile", icon: "bx-user" },
  schedule_round: { label: "Regular Round", icon: "bx-calendar" },
  review_candidate: { label: "HR Review Needed", icon: "bx-clipboard" },
};

// Statuses where the "Schedule Round" action is offered from the table.
// Broader than the profile view's single-state rule (move_to_next_round)
// because the table skips the intermediate "Move to Next Round" click —
// scheduling from shortlisted is natural intent, and no runtime FSM check
// blocks it.
export const SCHEDULE_ELIGIBLE_STATUSES: ReadonlySet<string> = new Set([
  "shortlisted",
  "move_to_next_round",
]);

export const CANDIDATE_ACTIONS_TRIGGER_LABEL = "Actions";
