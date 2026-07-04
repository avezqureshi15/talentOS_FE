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
    label: "Hiring Requests",
    icon: "bx bx-briefcase",
    isWizardAction: true,
  },
  {
    id: "applicants",
    label: "Applicants",
    icon: "bx bx-user",
    isWizardAction: true,
  },
  {
    id: "interviews",
    label: "Interviews",
    icon: "bx bx-calendar-check",
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
        id: "employees-ping",
        label: "Ping",
        icon: "bx bx-message",
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
