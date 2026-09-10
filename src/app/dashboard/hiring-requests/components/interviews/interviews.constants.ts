import type { InterviewSubTab } from "./interviews.types";

export const INTERVIEW_SUB_TABS: { key: InterviewSubTab; label: string; icon: string }[] = [
  { key: "incoming", label: "Incoming", icon: "bx bx-calendar" },
  { key: "completed", label: "Completed", icon: "bx bx-check-circle" },
  { key: "cancelled", label: "Cancelled", icon: "bx bx-x-circle" },
];

export const INTERVIEW_ROOM_LABEL = "Interview Room";
export const CANDIDATE_INFO_LABEL = "Candidate Info";
export const RESCHEDULE_LABEL = "Reschedule";
export const CANCEL_INTERVIEW_LABEL = "Cancel Interview";
export const CANCEL_CONFIRM_LABEL = "Confirm Cancel";
export const NO_INTERVIEWS_LABEL = "No interviews found";
export const COMING_SOON_LABEL = "Coming soon";
