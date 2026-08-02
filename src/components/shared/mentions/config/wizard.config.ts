import type { WizardActionConfig } from "../types";
import { fetchMockUsers, fetchMockInterviewers, fetchMockSlots, fetchMockRecruitments } from "../mock";

export const WIZARD_ACTIONS: Record<string, WizardActionConfig> = {
  "book-interview": {
    id: "book-interview",
    label: "Book Interview",
    icon: "bx bx-calendar-check",
    totalTokens: 5,
    executionCue: "Press Enter to run automated interview booking via AI Assistant",
    stages: [
      {
        stage: 1,
        // "Hiring Request" renamed to "Job Listing"
        header: "Select Job Listing...",
        fetcher: fetchMockRecruitments,
        tokenType: "hiring-request",
        isFinal: false,
      },
      {
        stage: 2,
        header: "Select Applicant...",
        fetcher: fetchMockUsers,
        tokenType: "applicant",
        isFinal: false,
      },
      {
        stage: 3,
        header: "Assign Interviewer...",
        fetcher: fetchMockInterviewers,
        tokenType: "interviewer",
        isFinal: false,
        isMultiSelect: true,
      },
      {
        stage: 4,
        header: "Select Available Slot...",
        fetcher: fetchMockSlots,
        tokenType: "slot",
        isFinal: true,
      },
    ],
  },
  "hr-request": {
    id: "hr-request",
    // "Hiring Requests" renamed to "Job Listings"
    label: "Job Listings",
    icon: "bx bx-briefcase",
    totalTokens: 2,
    executionCue: "Press Enter to send inquiry about Job Listings",
    stages: [
      {
        stage: 1,
        header: "Select Job Listings...",
        fetcher: fetchMockRecruitments,
        tokenType: "entity",
        isFinal: true,
      },
    ],
  },
  "employees-view": {
    id: "employees-view",
    label: "View Employees",
    icon: "bx bx-eye",
    totalTokens: 2,
    executionCue: "Press Enter to send inquiry about this employee",
    stages: [
      {
        stage: 1,
        header: "Select Employee...",
        fetcher: fetchMockUsers,
        tokenType: "entity",
        isFinal: true,
      },
    ],
  },
  "employees-ask-slots": {
    id: "employees-ask-slots",
    label: "Ask Slots",
    icon: "bx bx-clock",
    totalTokens: 2,
    executionCue: "Press Enter to submit slot request via AI Assistant",
    stages: [
      {
        stage: 1,
        header: "Select Employees...",
        fetcher: fetchMockUsers,
        tokenType: "ask-slots",
        isFinal: true,
        isMultiSelect: true,
      },
    ],
  },
  "send-mail": {
    id: "send-mail",
    label: "Send Mail",
    icon: "bx bx-envelope",
    totalTokens: 2,
    executionCue: "Press Enter to send mail via AI Assistant",
    stages: [
      {
        stage: 1,
        header: "Select User...",
        fetcher: fetchMockUsers,
        tokenType: "applicant",
        isFinal: true,
      },
    ],
  },
  "applicants-view": {
    id: "applicants-view",
    label: "View Applicants",
    icon: "bx bx-eye",
    totalTokens: 2,
    executionCue: "Press Enter to ask about this applicant",
    stages: [
      {
        stage: 1,
        header: "Select Applicant...",
        fetcher: fetchMockUsers,
        tokenType: "entity",
        isFinal: true,
      },
    ],
  },
  "interviews": {
    id: "interviews",
    label: "Interviews",
    icon: "bx bx-calendar-check",
    totalTokens: 3,
    executionCue: "Press Enter to ask about this interview",
    stages: [
      {
        stage: 1,
        header: "Select Candidate...",
        fetcher: async () => [],
        tokenType: "applicant",
        isFinal: false,
      },
      {
        stage: 2,
        header: "Select Interview...",
        fetcher: async () => [],
        tokenType: "interview",
        isFinal: true,
      },
    ],
  },
  "rounds": {
    id: "rounds",
    label: "Rounds",
    icon: "bx bx-calendar-check",
    totalTokens: 3,
    executionCue: "Press Enter to ask about this round",
    stages: [
      {
        stage: 1,
        header: "Select Candidate...",
        fetcher: async () => [],
        tokenType: "applicant",
        isFinal: false,
      },
      {
        stage: 2,
        header: "Select Round...",
        fetcher: async () => [],
        tokenType: "round",
        isFinal: true,
      },
    ],
  },
  "alerts": {
    id: "alerts",
    label: "Notifications",
    icon: "bx bx-bell",
    totalTokens: 2,
    executionCue: "Press Enter to ask about this notification",
    stages: [
      {
        stage: 1,
        header: "Select Notification...",
        fetcher: async () => [],
        tokenType: "alert",
        isFinal: true,
      },
    ],
  },
};

export const WIZARD_ACTION_IDS = Object.keys(WIZARD_ACTIONS);
