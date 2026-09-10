export const SLOT_GROUP_ORDER = ["Today", "Tomorrow"];
export const SLOT_FALLBACK_GROUP = "Other";

export const AI_ID = "ai";
export const AI_AUTO_SLOT_ID = "ai-auto-slot";

// Sentinel id for the "enter email manually" row — an interviewer who isn't
// an employee in the system, so there's no id/slots to pick from.
export const EXTERNAL_ID = "external";

export const SR_LABELS = {
  ROUND_TITLE_DEFAULT: "Untitled Round",
  STEP_1_TITLE: "Select Interviewer & Time Slot",
  STEP_1_DESC: "Select a time slot from the interviewer's availability.",
  INTERVIEWER_PLACEHOLDER: "Search interviewer...",
  NO_INTERVIEWER: "Select interviewers to see their availability.",
  AI_INTERVIEWER_NAME: "AI Interviewer",
  AI_INTERVIEWER_SUBLABEL: "Automated · no slot needed",
  AI_SELECTED_TITLE: "AI Interviewer selected",
  AI_SELECTED_DESC: "No time slot needed — the candidate gets an AI-conducted interview invite immediately.",
  NO_SLOTS: "No available slots.",
  ENTER_EMAIL_MANUALLY: "Enter email manually",
  EXTERNAL_INTERVIEWER_SUBLABEL: "If employee isn't added to platform",
  EXTERNAL_EMAIL_LABEL: "Interviewer email",
  EXTERNAL_EMAIL_PLACEHOLDER: "interviewer@company.com",
  EXTERNAL_NAME_LABEL: "Interviewer name (optional)",
  EXTERNAL_NAME_PLACEHOLDER: "Full name",
  EXTERNAL_DATE_LABEL: "Date",
  EXTERNAL_START_LABEL: "Start time",
  EXTERNAL_END_LABEL: "End time",
  EXTERNAL_TIME_ERROR: "End time must be after start time.",
  SEARCH_LOADING: "Loading...",
  SELECT_SLOT: "Select a time slot",
  SELECT_TEMPLATE: "Select an interview template",
  SELECT_DATE: "Select a date",
  SLOTS_AVAILABLE: "{count} slot{plural} available",
  NO_SLOTS_AVAILABLE: "No slots",
  ASK_SLOTS_TOOLTIP: "Ask for slots",
  ASK_SLOTS_BTN: "Ask for slots",
  ASK_SLOTS_FAILED: "Failed to request slots",
  ASK_SLOTS_ERROR: "Failed to request slots. Please try again.",

  STEP_2_TITLE: "Confirm & Send Invite",
  STEP_2_DESC: "Review the details and configure the meeting.",
  CANDIDATE_LABEL: "Candidate",
  INTERVIEWER_LABEL: "Interviewer",
  DATE_LABEL: "Date",
  TIME_LABEL: "Time",
  AI_SCHEDULE_HEADER: "AI-Scheduled Date",
  AI_SCHEDULE_TIME: "AI-Scheduled Time",
  GMEET_TOGGLE: "Generate Google Meet Link",
  INVITE_PREVIEW: "Hi {candidate}, your Round 1 interview with {interviewer} has been scheduled for {date} at {time}. A Google Meet link has been generated for this session.",

  STEP_3_SUCCESS: "Round 1 Scheduled Successfully!",
  STEP_3_RESCHEDULE_SUCCESS: "Interview Rescheduled Successfully!",
  STEP_3_AI_SUCCESS: "AI Interview Invite Sent!",
  STEP_3_SUBTEXT: "Google Meet link and calendar invites have been sent to {candidate} and {interviewer}.",
  STEP_3_AI_SUBTEXT: "{candidate} will receive an AI-conducted interview invite shortly. You can reschedule it anytime from the interview's Reschedule action.",
  DONE: "Done",

  BACK: "Back",
  NEXT: "Next",
  SEND_INVITE: "Send Invite",
  SEND_AI_INVITE: "Send AI Interview Invite",
  RESCHEDULE_CONFIRM: "Reschedule Interview",
  RESCHEDULING_LABEL: "Rescheduling...",
  SENDING_AI_LABEL: "Sending...",
};


