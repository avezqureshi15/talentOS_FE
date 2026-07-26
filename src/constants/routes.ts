export const ROUTES = {
  LOGIN: "/login",
  CHAT: "/chat",
  CHAT_ID: "/chat/:chatId",
  HIRING_REQUESTS: "/hiring-requests",
  HIRING_REQUESTS_ID: "/hiring-requests/:id",
  HIRING_APPLICATIONS: "/hiring-requests/:id/applications",
  HIRING_INTERVIEW_DESIGN: "/hiring-requests/:id/interview-design",
  HIRING_PROCTORING: "/hiring-requests/:id/proctoring",
  HIRING_EMAIL_MANAGER: "/hiring-requests/:id/email-manager",
  HIRING_TEAM_MEMBERS: "/hiring-requests/:id/team-members",
  HIRING_BOARD: "/hiring-requests/:id/board",
  BOOK_SLOT: "/book-slot",
  BOOK_SLOT_ID: "/book-slot/:formId",
  RATE_CANDIDATE: "/rate-candidate",
  RATE_CANDIDATE_ID: "/rate-candidate/:reviewFormId",
  ROUND_DETAILS: "/hiring-requests/:id/round-details/:roundId",
} as const;

export const HIRING_TABS = ["applications", "interview-design", "proctoring", "email-manager", "team-members"] as const;
