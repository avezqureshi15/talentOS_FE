/* ── Storage Keys ── */
export const STORAGE_KEYS = {
  THEME: "talentos_theme",
  AUTH_TOKEN: "token",
  UX: "_ux",
} as const;

/* ── Timing ── */
export const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
export const AURORA_AUTO_HIDE_MS = 8000;

/* ── Sidebar ── */
// "Hiring Requests" renamed to "Job Listings"
export const SIDEBAR_LABELS = {
  HIRING_REQUESTS: "Job Listings",
  SEARCH: "Search",
  NEW_CHAT: "New Chat",
  HISTORY: "History",
  TODAY: "Today",
  EARLIER: "Earlier",
  RENAME: "Rename",
  DELETE: "Delete",
  DELETE_CHAT_TITLE: "Delete chat?",
  DELETE_CHAT_CONFIRM: "This will permanently delete this chat and its messages.",
  CANCEL: "Cancel",
  DELETE_CONFIRM: "Delete",
  GROUP_WORKSPACE: "Workspace",
  GROUP_MANAGEMENT: "Management",
  GROUP_PLATFORM: "Platform",
} as const;

export const SIDEBAR_USER = {
  INITIALS: "AQ",
  NAME: "Avez Qureshi",
  EMAIL: "avezqureshi4785@gmail.com",
} as const;

/* ── Chat ── */
export const CHAT_SUGGESTIONS = [
  "Draft a Job Posting",
  "Get Benched Candidates",
  "Post JD",
];

export const EMPTY_STATE = {
  GREETING: "Good to see you",
} as const;

export const UI_LABELS = {
  ASK_ANYTHING: "Ask anything",
  FAST_MODE: "Fast",
  COMPOSE: "Compose",
  SEND: "Send",
  SENT: "Sent",
  CANCEL: "Cancel",
  EDIT_IN_GMAIL: "Edit in Gmail ↗",
  MESSAGE_SENT: "Message sent",
} as const;

/* ── Dashboard ── */
export const TABLE_HEADERS = [
  "Role",
  "Location",
  "Status",
  "Type",
  "Created",
] as const;

export const DROPDOWN_OPTIONS = [
  "Close Now",
  "Close in 24h",
  "Close in 3 days",
] as const;

export const JOB_DETAIL = {
  TITLE: "Frontend Engineer Hiring",
  SUBTITLE: "Manage job posting, review applicants, and track hiring pipeline.",
  JOB_DESCRIPTION: "Job Description",
  APPLICANTS: "Applicants (24)",
  EXPORT_AS_EXCEL: "Export as Excel",
} as const;

export const APPLICANT_LABELS = {
  QUEUING: "Queuing candidate for first round...",
  START_SCREENING: "Start Screening Round",
  REJECT: "Reject",
  ACCEPT: "Accept",
  EMAIL: "Email",
  PHONE: "Phone",
  APPLIED: "Applied",
  DETAILS: "Details",
  COVER_LETTER: "Cover Letter",
  AI_SUMMARY: "AI Summary",
  ROUNDS: "Rounds",
  LINKEDIN: "LinkedIn",
  CV: "CV",
  TIMELINE: "Timeline",
  CANDIDATE_REJECTED: "Candidate rejected",
  CANDIDATE_HIRED: "Candidate hired",
  READ_MORE: "Read more",
  VIEW_ALL_DETAILS: "View all details",
  NO_DETAILS: "No additional details available.",
  NO_AI_SUMMARY: "No AI summary available for this applicant yet.",
  NO_COVER_LETTER: "No Cover letter provided",
  CURRENT_CTC: "Current CTC",
  EXPECTED_CTC: "Expected CTC",
  YEARS_OF_EXPERIENCE: "Years of Experience",
  LOCATION: "Location",
  NOTICE_PERIOD: "Notice Period",
  HOW_DID_YOU_HEAR: "How did you hear",
  WILLING_TO_RELOCATE: "Willing to Relocate",
  JOB_IS_REMOTE: "Job is Remote",
  SELECT_CANDIDATE: "Select Candidate",
  REJECT_CANDIDATE: "Reject Candidate",
  NO_ROUNDS: "No interview rounds recorded yet.",
  LOADING_ROUNDS: "Loading rounds...",
  RETRY_ROUNDS: "Retry loading rounds",
  HR_SHORTLIST: "Shortlist",
  HR_REJECT: "Reject",
  SCHEDULE_ROUND_1: "Schedule Round 1",
  SCHEDULE_NEXT_ROUND: "Schedule Next Round",
  HR_REMARKS_TITLE: "HR Remarks",
  HR_REMARKS_PLACEHOLDER: "Enter your remarks for this selection...",
  MOVE_TO_NEXT_ROUND: "Move to Next Round",
  FINAL_SELECTION: "Final Selection",
  FINAL_SELECTION_WARNING: "This action is irreversible. Once confirmed, the candidate will be hired and removed from the pipeline.",
  AI_SHORTLISTED: "AI Shortlisted",
  AI_REJECTED: "AI Rejected",
  AI_PENDING: "AI Pending",
  REJECT_WARNING: "Rejecting this candidate may move them outside the hiring pipeline. Are you sure?",
  FINAL_DECISION_CONFIRM: "Are you sure you want to {action} this candidate? After this the candidate will move out of the hiring pipeline.",
} as const;

export const TIMELINE_LABELS = {
  CANDIDATE_JOURNEY: "Candidate Journey",
  DOWNLOAD_RESUME: "Download Resume",
  ADD_REMARK: "Add Remark",
} as const;

/* ── API ── */
export const API_V1_PREFIX = "/api/v1";
export const CHAT_STREAM_ENDPOINT = `${API_V1_PREFIX}/chat/stream`;
export const BE_API_BASE_URL = import.meta.env.VITE_BE_API_BASE_URL ?? "http://localhost:8001/api/v1";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8001";

/* ── APP ── */
export const APP_URL = import.meta.env.VITE_APP_URL ?? "http://localhost:5173";
export const SLOT_DURATION_MINUTES = Number(import.meta.env.VITE_SLOT_DURATION_MINUTES ?? 30);

/* ── AUTH ── */
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";
export const ACCESS_TOKEN_KEY = "auth_access_token";

export const QUERY_KEYS = {
  CHAT_STREAM: "chat-stream",
  CHAT_HISTORY: "chat-history",
  CHAT_MESSAGES: "chat-messages",
  HIRING_REQUESTS: "hiring-requests",
  HIRING_REQUEST: "hiring-request",
  DEPARTMENTS: "departments",
  LOCATIONS: "locations",
  TYPES: "types",
  APPLICATIONS: "applications",
  FINAL_VERDICTS: "final-verdicts",
  INTERVIEWS: "interviews",
  NOTIFICATIONS: "notifications",
  ROUNDS: "rounds",
  ROUND_DETAIL: "round-detail",
  SLOT_FORM: "slot-form",
  INTERVIEWER_SLOTS: "interviewer-slots",
  INTERVIEWER_SEARCH: "interviewer-search",
  ROLES: "roles",
  ROLE: "role",
  TENANT: "tenant",
  TENANT_USERS: "tenant-users",
  TENANT_INVITES: "tenant-invites",
  AI_INTERVIEWS: "ai-interviews",
  AI_SCREENING: "ai-screening",
  AI_QUESTIONS: "ai-questions",
  JOB_TEAM: "job-team",
} as const;

export const QUERY_CONFIG = {
  DEFAULT_STALE_TIME: 30_000,
  DEFAULT_RETRY_COUNT: 3,
} as const;

export const EXPORT_LABELS = {
  EXPORT_AS_EXCEL: "Export as Excel",
  DOWNLOADING: "Downloading...",
} as const;

export const FILTER_OPTIONS = {
  DEPARTMENTS: ["Engineering", "Design", "Marketing", "Sales", "HR", "Finance", "Operations"],
  LOCATIONS: ["Remote", "New York", "San Francisco", "London", "Berlin", "Singapore", "Tokyo"],
  TYPES: ["Full-time", "Part-time", "Contract", "Internship", "Freelance"],
} as const;

export const PER_PAGE_OPTIONS = [5, 10, 50] as const;

export const HR_TABS = [
  // "Hiring Requests" renamed to "Job Listings"
  { key: "hiring-requests", label: "All Job Listings", icon: "bx bx-briefcase" },
  // { key: "interviews", label: "Interviews", icon: "bx bx-calendar-check" },
  // { key: "alerts", label: "Alerts", icon: "bx bx-bell" },
] as const;

export const ALERTS_DESCRIPTION =
  "This section lists employees who missed the slot submission or candidate review deadline after a reminder.";

export const PROFILE_MENU_ITEMS = [
  { id: "profile", label: "Profile", icon: "bx bx-user" },
  { id: "settings", label: "Settings", icon: "bx bx-cog" },
  { id: "keyboard-shortcuts", label: "Keyboard shortcuts", icon: "bx bx-keyboard" },
] as const;

export const PROFILE_DANGER_ITEM = { id: "logout", label: "Log out", icon: "bx bx-arrow-out-right-square-half" } as const;

export const LOGOUT_MODAL = {
  TITLE: "Log out",
  BODY: "Are you sure you want to log out? You'll need to sign in again to access your account.",
  CANCEL: "Cancel",
  CONFIRM: "Log out",
} as const;

export const PROFILE_MODAL = {
  TITLE: "Profile",
  ICON: "bx bx-user",
  DELETE_CHATS: "Delete all chats",
  DELETE_CHATS_CONFIRM: "Are you sure you want to delete all chats? This action cannot be undone.",
  DELETE_CHATS_CANCEL: "Cancel",
  DELETE_CHATS_CONFIRM_BTN: "Delete all",
} as const;

export const SETTINGS_MODAL = {
  TITLE: "Settings",
  ICON: "bx bx-cog",
  THEME_LABEL: "Theme",
  THEME_SYSTEM: "System",
  THEME_DARK: "Dark",
  THEME_LIGHT: "Light",
  THEME_FOLLOWING_SYSTEM: "Following system preference",
  APPS_TAB: "Apps",
  APPS_TITLE: "Apps",
  APPS_DESCRIPTION: "Manage your connected apps, API keys, and integrations.",
  MANAGE_APPS: "Manage apps",
} as const;

export const KEYBOARD_SHORTCUTS_MODAL = {
  TITLE: "Keyboard shortcuts",
  ICON: "bx bx-keyboard",
} as const;

export const KEYBOARD_SHORTCUTS_LIST = [
  { label: "New Chat", keys: "Ctrl+Shift+C" },
  // "Hiring Requests" renamed to "Job Listings"
  { label: "Job Listings", keys: "Ctrl+Shift+H" },
  { label: "Notifications", keys: "Ctrl+Shift+A" },
  { label: "Search", keys: "Ctrl+K" },
  { label: "Toggle Sidebar", keys: "Ctrl+Shift+S" },
  { label: "Shortcuts Menu", keys: "Alt+K" },
] as const;

