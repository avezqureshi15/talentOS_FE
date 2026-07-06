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
export const SIDEBAR_LABELS = {
  HIRING_REQUESTS: "Hiring Requests",
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

import type { InterviewRound } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

export const MOCK_ROUNDS: InterviewRound[] = [
  {
    id: "r1",
    round: "Technical Round 1",
    interviewer: "Avez Qureshi",
    role: "Senior Frontend Engineer",
    jdHref: "/hiring-requests/hr-001",
    jdLabel: "React, TypeScript, Next.js, and Tailwind CSS. 4+ years experience required.",
    candidate: "Engineering Team / Frontend Lead",
    occurredOn: "June 27, 2026 • 10:30 AM",
    slot: "10:30 AM – 11:15 AM",
    duration: "45 min",
    interviewType: "Technical Round 1 (Google Meet)",
    status: "Completed",
    ratings: [
      { label: "Communication", score: 3, maxScore: 4 },
      { label: "Technical Skills", score: 4, maxScore: 4 },
      { label: "Problem Solving", score: 2, maxScore: 4 },
      { label: "Cultural Fit", score: 3, maxScore: 4 },
    ],
    skills: ["React", "TypeScript", "State Management"],
    notes: "Strong React and TypeScript fundamentals. Needs improvement in system design and architectural thinking.",
    aiSummary: "Overall Assessment:\nStrong technical candidate with solid frontend fundamentals.\n• Strengths: Deep React and TypeScript knowledge, good component architecture\n• Areas to Improve: System design and large-scale state management patterns\n• Communication: Clear and articulate when discussing technical concepts\n• Verdict: Recommended to advance to next round",
    verdict: "advance",
    aiDecision: "selected",
    hrDecision: "pending",
  },
  {
    id: "r2",
    round: "Technical Round 2",
    interviewer: "Pranav Kumar",
    role: "Senior Frontend Engineer",
    jdHref: "/hiring-requests/hr-001",
    jdLabel: "React, TypeScript, Next.js, and Tailwind CSS. 4+ years experience required.",
    candidate: "Engineering Team / Frontend Lead",
    occurredOn: "July 2, 2026 • 2:00 PM",
    slot: "2:00 PM – 2:45 PM",
    duration: "45 min",
    interviewType: "Technical Round 2 (Google Meet)",
    status: "Scheduled",
    ratings: [],
    skills: [],
    notes: "",
    aiSummary: "Overall Assessment:\nInterview yet to be conducted. No AI analysis available.\n• Status: Scheduled\n• No data to evaluate at this stage",
    verdict: "hold",
    aiDecision: "pending",
    hrDecision: "pending",
  },
  {
    id: "r3",
    round: "HR Round",
    interviewer: "HR Team",
    role: "Senior Frontend Engineer",
    jdHref: "/hiring-requests/hr-001",
    jdLabel: "React, TypeScript, Next.js, and Tailwind CSS. 4+ years experience required.",
    candidate: "Engineering Team / Frontend Lead",
    occurredOn: "July 5, 2026 • 11:00 AM",
    slot: "11:00 AM – 11:30 AM",
    duration: "30 min",
    interviewType: "HR Round (Google Meet)",
    status: "Pending",
    ratings: [],
    skills: [],
    notes: "",
    aiSummary: "Overall Assessment:\nPending HR evaluation. No technical concerns flagged.\n• Status: Pending scheduling confirmation",
    verdict: "hold",
    aiDecision: "pending",
    hrDecision: "pending",
  },
  {
    id: "r4",
    round: "Screening Round",
    interviewer: "HR Team",
    role: "Senior Frontend Engineer",
    jdHref: "/hiring-requests/hr-001",
    jdLabel: "React, TypeScript, Next.js, and Tailwind CSS. 4+ years experience required.",
    candidate: "Engineering Team / Frontend Lead",
    occurredOn: "June 20, 2026 • 9:00 AM",
    slot: "9:00 AM – 9:30 AM",
    duration: "30 min",
    interviewType: "Screening (Phone)",
    status: "Completed",
    ratings: [
      { label: "Communication", score: 4, maxScore: 4 },
      { label: "Technical Skills", score: 3, maxScore: 4 },
      { label: "Problem Solving", score: 3, maxScore: 4 },
      { label: "Cultural Fit", score: 4, maxScore: 4 },
    ],
    skills: ["React", "TypeScript"],
    notes: "Good communication skills. Has relevant experience. Proceed to technical round.",
    aiSummary: "Overall Assessment:\nCandidate meets minimum qualifications for the role.\n• Strengths: Excellent communication, relevant domain experience, strong cultural alignment\n• Areas to Improve: Deep technical breadth yet to be assessed\n• Communication: Very responsive and well-prepared\n• Verdict: Clear pass — proceed to technical round",
    verdict: "advance",
    aiDecision: "selected",
    hrDecision: "approved",
  },
  {
    id: "r5",
    round: "Take-Home Assignment",
    interviewer: "Tech Team",
    role: "Senior Frontend Engineer",
    jdHref: "/hiring-requests/hr-001",
    jdLabel: "React, TypeScript, Next.js, and Tailwind CSS. 4+ years experience required.",
    candidate: "Engineering Team / Frontend Lead",
    occurredOn: "June 22, 2026 • 6:00 PM",
    slot: "Submitted: June 25, 2026",
    duration: "3 days",
    interviewType: "Take-Home (Async)",
    status: "Completed",
    ratings: [
      { label: "Code Quality", score: 4, maxScore: 4 },
      { label: "Architecture", score: 3, maxScore: 4 },
      { label: "UI/UX Sense", score: 3, maxScore: 4 },
      { label: "Documentation", score: 2, maxScore: 4 },
    ],
    skills: ["React", "TypeScript", "Next.js", "Tailwind"],
    notes: "Clean code with good component structure. Could improve test coverage and documentation.",
    aiSummary: "Overall Assessment:\nSolid take-home submission demonstrating strong engineering practices.\n• Strengths: Clean component architecture, good use of Next.js patterns, well-organized codebase\n• Areas to Improve: Test coverage below threshold, sparse documentation\n• Code Quality: 4/4 — production-ready code\n• Verdict: Pass — proceed to final round",
    verdict: "advance",
    aiDecision: "selected",
    hrDecision: "pending",
  },
];

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
  SELECT_CANDIDATE: "Select Candidate",
  REJECT_CANDIDATE: "Reject Candidate",
  NO_ROUNDS: "No interview rounds recorded yet.",
  HR_SHORTLIST: "Shortlist",
  HR_REJECT: "Reject",
  SCHEDULE_ROUND_1: "Schedule Round 1",
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
// TODO: Move these base URLs to environment variables (e.g. VITE_API_BASE_URL)
export const CHAT_STREAM_ENDPOINT = "/api/v1/chat/stream";
export const BE_API_BASE_URL = "http://localhost:8001/api/v1";
export const API_BASE_URL = "http://localhost:8001";

/* ── APP ── */
export const APP_URL = import.meta.env.VITE_APP_URL ?? "http://localhost:5173";

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
  { key: "hiring-requests", label: "All Hiring Requests", icon: "bx bx-briefcase" },
  { key: "interviews", label: "Interviews", icon: "bx bx-calendar-check" },
  { key: "action-center", label: "Action Center", icon: "bx bx-bell" },
] as const;

export const ACTION_CENTER_TABS = [
  { key: "slots", label: "Slots", icon: "bx bx-stopwatch" },
  { key: "reviews", label: "Reviews", icon: "bx bx-check-shield" },
] as const;

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
  THEME_DARK: "Dark",
  THEME_LIGHT: "Light",
} as const;

export const KEYBOARD_SHORTCUTS_MODAL = {
  TITLE: "Keyboard shortcuts",
  ICON: "bx bx-keyboard",
} as const;

export const KEYBOARD_SHORTCUTS_LIST = [
  { label: "New Chat", keys: "Ctrl+Shift+C" },
  { label: "Hiring Requests", keys: "Ctrl+Shift+H" },
  { label: "Interviews", keys: "Ctrl+Shift+I" },
  { label: "Action Center", keys: "Ctrl+Shift+A" },
  { label: "Search", keys: "Ctrl+K" },
  { label: "Toggle Sidebar", keys: "Ctrl+Shift+S" },
  { label: "Shortcuts Menu", keys: "Alt+K" },
] as const;

