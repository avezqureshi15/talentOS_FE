export const MENTIONS_LABELS = {
  NO_RESULTS: "No results found",
  BACK: "Back",
  SEARCH: "Search...",
} as const;

export const WIZARD_LABELS = {
  STAGE_0_HEADER: "Quick Actions",
  STAGE_1_HEADER: "Select Applicant...",
  STAGE_2_HEADER: "Assign Interviewer...",
  STAGE_3_HEADER: "Select Available Slot...",
  EXECUTION_CUE: "\u21B5 Press Enter to run automated interview booking via AI Assistant",
  ACTION_TOKEN: "Book Interview",
} as const;

export const TOKEN_ICONS: Record<string, string> = {
  action: "bx bx-calendar",
  applicant: "bx bx-user",
  interviewer: "bx bx-user-check",
  slot: "bx bx-clock",
  entity: "bx bx-briefcase-alt-2",
  "ask-slots": "bx bx-clock",
  "send-mail": "bx bx-envelope",
  "hiring-request": "bx bx-briefcase",
  "interview": "bx bx-calendar-check",
};

export const ICON_RULES: { match: (id: string) => boolean; icon: string }[] = [
  { match: (id) => id.endsWith("-view"), icon: "bx bx-eye" },
  { match: (id) => id.includes("send-mail") || id.includes("mail"), icon: "bx bx-envelope" },
  { match: (id) => id.endsWith("-slots") || id.includes("slot"), icon: "bx bx-clock" },
  { match: (id) => id.includes("ask"), icon: "bx bx-plus-circle" },
];

export const SLOT_GROUP_ORDER = ["Today", "Tomorrow"];

export const SLOT_FALLBACK_GROUP = "Other";
