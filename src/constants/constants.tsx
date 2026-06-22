import { Icon } from "@/components/ui/icons";

/* ── Data ── */
export const ACTION_BTNS = [
  { Icon: Icon.Copy, label: "Copy" },
  { Icon: Icon.Link, label: "Link" },
  { Icon: Icon.ThumbUp, label: "Good" },
  { Icon: Icon.ThumbDown, label: "Bad" },
  { Icon: Icon.Refresh, label: "Retry" },
  { Icon: Icon.Dots, label: "More" },
];

/* ── Sidebar ── */
export const SIDEBAR_LABELS = {
  HIRING_REQUESTS: "Hiring Requests",
  SEARCH: "Search",
  NEW_CHAT: "New Chat",
  HISTORY: "History",
  TODAY: "Today",
  EARLIER: "Earlier",
} as const;

export const SIDEBAR_USER = {
  INITIALS: "AQ",
  NAME: "Avez Qureshi",
  EMAIL: "avezqureshi4785@gmail.com",
} as const;

/* ── Chat ── */
export const CHAT_SUGGESTIONS = [
  "Explain React hooks simply",
  "Give me LeetCode plan",
  "Optimize my resume",
];

export const EMPTY_STATE = {
  GREETING: "Good to see you, Avez",
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
  "Applicants",
  "Status",
  "Close Application",
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
  COVER_LETTER: "Cover Letter",
  LINKEDIN: "LinkedIn",
  CV: "CV",
  TIMELINE: "Timeline",
  CANDIDATE_REJECTED: "Candidate rejected",
  CANDIDATE_HIRED: "Candidate hired",
  READ_MORE: "Read more",
} as const;

export const TIMELINE_LABELS = {
  CANDIDATE_JOURNEY: "Candidate Journey",
  DOWNLOAD_RESUME: "Download Resume",
  ADD_REMARK: "Add Remark",
} as const;

/* ── API ── */
export const CHAT_STREAM_ENDPOINT = "/api/v1/chat/stream";
export const BE_API_BASE_URL = "http://localhost:8001/api/v1";
export const API_BASE_URL = "http://localhost:8001";

export const QUERY_KEYS = {
  CHAT_STREAM: "chat-stream",
  CHAT_HISTORY: "chat-history",
  CHAT_MESSAGES: "chat-messages",
  HIRING_REQUESTS: "hiring-requests",
  HIRING_REQUEST: "hiring-request",
  APPLICATIONS: "applications",
} as const;

export const QUERY_CONFIG = {
  DEFAULT_STALE_TIME: 30_000,
  DEFAULT_RETRY_COUNT: 3,
} as const;

export const EXPORT_LABELS = {
  EXPORT_AS_EXCEL: "Export as Excel",
  DOWNLOADING: "Downloading...",
} as const;