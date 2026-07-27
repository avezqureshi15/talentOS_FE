export const SLOT_GROUP_ORDER = ["Today", "Tomorrow"];
export const SLOT_FALLBACK_GROUP = "Other";

export const AI_ID = "ai";
export const AI_SCREENING_ID = "ai-screening";
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
  AI_SCREENING_NAME: "AI Screening Interview",
  AI_SLOTS_LABEL: "Always available",
  AI_DURATION_BADGE: "~30 mins",
  AI_VOICE_TEXT_BADGE: "Video, Voice & Text",
  AI_VOICE_TEXT_SCREENING_BADGE: "Voice & Text",
  PROCTORING_LABEL: "Proctoring",
  INSIGHTS_LABEL: "Insights",
  TEAM_MEMBERS_LABEL: "Team",

  SCREENING_ROUND_TITLE: "AI Screening Configuration",
  SCREENING_ENABLED: "Voice Screening",
  SCREENING_DISABLED: "Voice Screening",
  SCREENING_CALL_WINDOW: "Call Window",
  SCREENING_TIMEZONE: "Timezone",
  SCREENING_QUESTIONS: "Screening Questions",
  SCREENING_TRIGGER: "Trigger AI Screening",
  SCREENING_TRIGGERED: "Screening Triggered",

  INTERVIEW_ROUND_TITLE: "AI Interview Configuration",
  INTERVIEW_QUESTIONS: "Interview Questions",
  INTERVIEW_TOTAL: "Total",
  INTERVIEW_SEND: "Send AI Interview Link",
  INTERVIEW_EXPECTED: "Expected Points",
  AI_SCHEDULE_DATE: "Select Date",
  AI_SCHEDULE_TIME: "Select Time",
  AI_SCHEDULE_HEADER: "Schedule",
};

import type { ScreeningRoundConfig, InterviewRoundConfig } from "./schedule-round-modal.types";

export const AI_SLOT_ID = "ai-interview-confirmed";

export const DUMMY_SCREENING_ROUND: ScreeningRoundConfig = {
  voice_screening_enabled: true,
  screening_call_from: "10:00",
  screening_call_to: "18:00",
  screening_timezone: "Asia/Kolkata",
  screening_questions: [
    { id: "sq-1", question: "What is your current CTC?" },
    { id: "sq-2", question: "What is your expected CTC?" },
    { id: "sq-3", question: "What is your notice period?" },
    { id: "sq-4", question: "Why do you want to leave your current role?" },
    { id: "sq-5", question: "Where are you currently located?" },
    { id: "sq-6", question: "Are you comfortable working remotely?" },
  ],
};

export const DUMMY_INTERVIEW_ROUND: InterviewRoundConfig = {
  interview_total_score: 85,
  interview_questions: [
    {
      id: "iq-1",
      question: "Explain how React's virtual DOM works and its role in performance optimization.",
      score: 20,
      expected_points: [
        "Understanding of virtual DOM diffing algorithm",
        "Reconciliation process and key prop importance",
        "Batching of updates and Fiber architecture",
      ],
    },
    {
      id: "iq-2",
      question: "How would you identify and fix performance issues in a slow React application?",
      score: 25,
      expected_points: [
        "Profiling with React DevTools",
        "useMemo and useCallback strategies",
        "Code splitting with React.lazy and Suspense",
        "Avoiding unnecessary re-renders",
      ],
    },
    {
      id: "iq-3",
      question: "Describe a real-world scenario where you managed complex state across multiple components.",
      score: 20,
      expected_points: [
        "State lifting vs context vs external state library",
        "Handling side effects and data dependencies",
        "Testability and maintainability considerations",
      ],
    },
    {
      id: "iq-4",
      question: "Implement a custom hook for polling an API endpoint at a configurable interval.",
      score: 20,
      expected_points: [
        "useEffect cleanup to prevent memory leaks",
        "Configurable delay and enabled/disabled toggle",
        "Error handling and retry logic",
      ],
    },
  ],
};


