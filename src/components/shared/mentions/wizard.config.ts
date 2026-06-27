import type { WizardActionConfig } from "./mentions.types";
import { fetchMockUsers, fetchMockInterviewers, fetchMockSlots, fetchMockRecruitments } from "./mock-api";

export const WIZARD_ACTIONS: Record<string, WizardActionConfig> = {
  "book-interview": {
    id: "book-interview",
    label: "Book Interview",
    icon: "bx bx-calendar-check",
    totalTokens: 4,
    executionCue: "Press Enter to run automated interview booking via AI Assistant",
    stages: [
      {
        stage: 1,
        header: "Select Applicant...",
        fetcher: fetchMockUsers,
        tokenType: "applicant",
        isFinal: false,
      },
      {
        stage: 2,
        header: "Assign Interviewer...",
        fetcher: fetchMockInterviewers,
        tokenType: "interviewer",
        isFinal: false,
      },
      {
        stage: 3,
        header: "Select Available Slot...",
        fetcher: fetchMockSlots,
        tokenType: "slot",
        isFinal: true,
      },
    ],
  },
  "employees-ping": {
    id: "employees-ping",
    label: "Ping",
    icon: "bx bx-message",
    totalTokens: 2,
    executionCue: "Press Enter to send ping via AI Assistant",
    stages: [
      {
        stage: 1,
        header: "Select Employee...",
        fetcher: fetchMockUsers,
        tokenType: "applicant",
        isFinal: true,
      },
    ],
  },
  "hr-request": {
    id: "hr-request",
    label: "HR Request",
    icon: "bx bx-briefcase",
    totalTokens: 2,
    executionCue: "Press Enter to send inquiry about this HR request",
    stages: [
      {
        stage: 1,
        header: "Select HR Request...",
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
  "applicants": {
    id: "applicants",
    label: "Applicants",
    icon: "bx bx-user",
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
};

export const WIZARD_ACTION_IDS = Object.keys(WIZARD_ACTIONS);
