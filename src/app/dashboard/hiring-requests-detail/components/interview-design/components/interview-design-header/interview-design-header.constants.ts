import type { InterviewTimeStatus } from "../../interview-design.types";

export const INTERVIEW_DESIGN_HEADER_LABELS = {
  TITLE: "Interview Design",
  SAVE: "Save Changes",
  SAVING: "Saving...",
  CLOSE: "Close",
  MINUTES_SUFFIX: "min",
  TARGET_PREFIX: "target",
  TIME_STATUS_LABEL: {
    ok: "On track",
    warning: "Approaching limit",
    danger: "Over target",
  } satisfies Record<InterviewTimeStatus, string>,
} as const;
