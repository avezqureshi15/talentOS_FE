export const HYBRID_INTENT_ICONS: Record<string, string> = {
  INQUIRE_HR_REQUEST: "bx bx-briefcase",
  INQUIRE_APPLICANT: "bx bx-user",
  INQUIRE_EMPLOYEE: "bx bx-user",
  INQUIRE_INTERVIEW: "bx bx-calendar-check",
};

export const HYBRID_INTENT_FALLBACK_ICON = "bx bx-id-card";

export const INTENT_HEADER_ICONS: Record<string, string> = {
  "book-interview": "bx bx-calendar-check",
  "ASK_SLOTS": "bx bx-clock",
  "SEND_MAIL": "bx bx-envelope",
  "interviews": "bx bx-calendar-check",
  "employees-send-mail": "bx bx-envelope",
  "applicants-send-mail": "bx bx-envelope",
  "hr-request": "bx bx-briefcase",
  "applicants": "bx bx-user",
  "applicants-view": "bx bx-eye",
  "employees-view": "bx bx-eye",
  "employees-ask-slots": "bx bx-clock",
  "INQUIRE_HR_REQUEST": "bx bx-briefcase",
  "INQUIRE_APPLICANT": "bx bx-user",
  "INQUIRE_EMPLOYEE": "bx bx-user",
  "INQUIRE_INTERVIEW": "bx bx-calendar-check",
};

export const COMMAND_CARD_LABELS = {
  SLOT_BOOKING: "Slot Booking Request",
  SEND_MAIL: "Send Mail",
  INTERVIEW_BOOKING: "Interview Booking Request",
  HIRING_REQUEST: "Hiring Requests",
  CANDIDATE: "Candidate",
  INTERVIEWER: "Interviewer",
  TIME_SLOT: "Time Slot",
  EMPLOYEES: "Employees",
  EMPLOYEE: "Employee",
  NO_QUESTION: "No question provided",
  UNKNOWN: "Unknown",
} as const;

export const INTENT_LABELS: Record<string, string> = {
  "book-interview": "Book Interview",
  "ASK_SLOTS": "Slot Booking Request",
  "SEND_MAIL": "Send Mail",
  "interviews": "Interviews",
  "employees-send-mail": "Send Mail",
  "applicants-send-mail": "Send Mail",
  "hr-request": "Hiring Requests",
  "applicants": "Applicants",
  "applicants-view": "View Applicants",
  "employees-view": "View Employees",
  "employees-ask-slots": "Ask Slots",
  "INQUIRE_HR_REQUEST": "Hiring Requests",
  "INQUIRE_APPLICANT": "Applicant Inquiry",
  "INQUIRE_EMPLOYEE": "Employee Inquiry",
  "INQUIRE_INTERVIEW": "Interview Inquiry",
  "UNKNOWN": "Unknown Command",
};
