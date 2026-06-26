import type { CommandEntry } from "./mentions.types";
import { fetchMockRecruitments, fetchMockUsers, fetchMockSlots } from "./mock-api";

export const ROOT_MENU: CommandEntry[] = [
  {
    id: "hr-request",
    label: "HR Request",
    icon: "bx bx-briefcase",
    searchPlaceholder: "Search HR requests...",
    fetcher: fetchMockRecruitments,
    getInsertText: (item) => (item ? `#${item.label}` : ""),
  },
  {
    id: "applicants",
    label: "Applicants",
    icon: "bx bx-user",
    searchPlaceholder: "Search applicants...",
    fetcher: fetchMockUsers,
    getInsertText: () => "View Applicants",
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
        searchPlaceholder: "Search employees...",
        fetcher: fetchMockUsers,
        getInsertText: () => "View all employees",
      },
      {
        id: "employees-ping",
        label: "Ping",
        icon: "bx bx-message",
        searchPlaceholder: "Search employee to ping...",
        fetcher: fetchMockUsers,
        getInsertText: (item) => (item ? `Ping @${item.label}` : ""),
      },
    ],
  },
  {
    id: "interviewers",
    label: "Interviewers for the JD",
    icon: "bx bx-user-check",
    children: [
      {
        id: "interviewers-view",
        label: "View Interviewers",
        icon: "bx bx-eye",
        searchPlaceholder: "Search interviewers...",
        fetcher: fetchMockUsers,
        getInsertText: () => "View all interviewers",
      },
      {
        id: "interviewers-ping",
        label: "Ping",
        icon: "bx bx-message",
        searchPlaceholder: "Search employee to ping...",
        fetcher: fetchMockUsers,
        getInsertText: (item) => (item ? `Ping @${item.label}` : ""),
      },
      {
        id: "interviewers-slots",
        label: "Slots",
        icon: "bx bx-timer",
        children: [
          {
            id: "slots-ask",
            label: "Ask for Slots",
            icon: "bx bx-plus-circle",
            getInsertText: () => "Ask for available interview slots",
          },
          {
            id: "slots-list",
            label: "List all Slots",
            icon: "bx bx-timer",
            searchPlaceholder: "Search slots...",
            fetcher: fetchMockSlots,
            getInsertText: (item) => (item ? `Slot: ${item.label}` : ""),
          },
        ],
      },
    ],
  },
];
