import type { CommandEntry } from "../types";

export const ROOT_MENU: CommandEntry[] = [
  {
    id: "book-interview",
    label: "Book Interview",
    icon: "bx bx-calendar-check",
    isWizardAction: true,
    getInsertText: () => "Book Interview",
  },
  {
    id: "hr-request",
    // "Hiring Requests" renamed to "Job Listings"
    label: "Job Listings",
    icon: "bx bx-briefcase",
    isWizardAction: true,
  },
  {
    id: "applicants",
    label: "Applicants",
    icon: "bx bx-user",
    children: [
      {
        id: "applicants-view",
        label: "View Applicants",
        icon: "bx bx-eye",
        isWizardAction: true,
      },
      {
        id: "rounds",
        label: "Rounds",
        icon: "bx bx-calendar-check",
        isWizardAction: true,
      },
      {
        id: "interviews",
        label: "Interviews",
        icon: "bx bx-calendar-check",
        isWizardAction: true,
      },
    ],
  },
  {
    id: "alerts",
    label: "Alerts",
    icon: "bx bx-bell",
    isWizardAction: true,
  },
  {
    id: "send-mail",
    label: "Send Mail",
    icon: "bx bx-envelope",
    isWizardAction: true,
  },
  {
    id: "employees",
    label: "Employees",
    icon: "bx bx-group",
    children: [
      {
        id: "employees-view",
        label: "View Employees",
        icon: "bx bx-eye",
        isWizardAction: true,
      },
      {
        id: "employees-ask-slots",
        label: "Ask Slots",
        icon: "bx bx-clock",
        isWizardAction: true,
      },
    ],
  },
];
