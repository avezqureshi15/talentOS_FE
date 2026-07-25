export const SLOT_GROUP_ORDER = ["Today", "Tomorrow"];
export const SLOT_FALLBACK_GROUP = "Other";

export const AI_ID = "ai";
export const AI_AUTO_SLOT_ID = "ai-auto-slot";

export const SR_LABELS = {
  ROUND_TITLE_DEFAULT: "Untitled Round",
  STEP_1_TITLE: "Select Interviewer & Time Slot",
  STEP_1_DESC: "Select a time slot from the interviewer's availability.",
  INTERVIEWER_PLACEHOLDER: "Search interviewer...",
  NO_INTERVIEWER: "Select interviewers to see their availability.",
  NO_SLOTS: "No available slots.",
  SEARCH_LOADING: "Loading...",
  SELECT_SLOT: "Select a time slot",
  SELECT_TEMPLATE: "Select an interview template",
  SELECT_DATE: "Select a date",
  SLOTS_AVAILABLE: "{count} slot{plural} available",
  NO_SLOTS_AVAILABLE: "No slots",
  ASK_SLOTS_TOOLTIP: "Ask {name} for Slots",
  ASK_SLOTS_FAILED: "Failed to request slots",
  ASK_SLOTS_ERROR: "Failed to request slots. Please try again.",

  STEP_2_TITLE: "Confirm & Send Invite",
  STEP_2_DESC: "Review the details and configure the meeting.",
  CANDIDATE_LABEL: "Candidate",
  INTERVIEWER_LABEL: "Interviewer",
  DATE_LABEL: "Date",
  TIME_LABEL: "Time",
  GMEET_TOGGLE: "Generate Google Meet Link",
  INVITE_PREVIEW: "Hi {candidate}, your Round 1 interview with {interviewer} has been scheduled for {date} at {time}. A Google Meet link has been generated for this session.",

  STEP_3_SUCCESS: "Round 1 Scheduled Successfully!",
  STEP_3_RESCHEDULE_SUCCESS: "Interview Rescheduled Successfully!",
  STEP_3_SUBTEXT: "Google Meet link and calendar invites have been sent to {candidate} and {interviewer}.",
  DONE: "Done",

  BACK: "Back",
  NEXT: "Next",
  SEND_INVITE: "Send Invite",
  RESCHEDULE_CONFIRM: "Reschedule Interview",
  RESCHEDULING_LABEL: "Rescheduling...",

  AI_NAME: "AI Interviewer",
  AI_SLOTS_LABEL: "Always available",
  PROCTORING_LABEL: "Proctoring",
  INSIGHTS_LABEL: "Insights",
  TEAM_MEMBERS_LABEL: "Team",
};

import type { AiTemplate } from "./schedule-round-modal.types";

export const AI_TEMPLATES: AiTemplate[] = [
  {
    id: "frontend",
    name: "Frontend Interview Template",
    description: "AI-powered interview for frontend engineering roles",
    proctoring: [
      { label: "Proctoring", enabled: true },
      { label: "Lockdown Browser", enabled: true },
      { label: "Candidate Force Visibility", enabled: true },
      { label: "Require Screen Share", enabled: true },
      { label: "Block Multiple Monitors", enabled: false },
      { label: "Restrict Mobile Browsers", enabled: true },
    ],
    insights: [
      "Live coding analysis",
      "Problem-solving assessment",
      "Communication score",
    ],
    teamMembers: [
      { name: "Alice", initials: "AL" },
      { name: "Bob", initials: "BO" },
    ],
  },
  {
    id: "backend",
    name: "Backend Engineer Interview Template",
    description: "AI-powered interview for backend engineering roles",
    proctoring: [
      { label: "Proctoring", enabled: true },
      { label: "Lockdown Browser", enabled: false },
      { label: "Candidate Force Visibility", enabled: true },
      { label: "Require Screen Share", enabled: true },
      { label: "Block Multiple Monitors", enabled: true },
      { label: "Restrict Mobile Browsers", enabled: false },
    ],
    insights: [
      "System design evaluation",
      "API design assessment",
      "Scalability analysis",
    ],
    teamMembers: [
      { name: "Charlie", initials: "CH" },
      { name: "Diana", initials: "DI" },
    ],
  },
];
