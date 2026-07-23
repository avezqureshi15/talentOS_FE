export const ROUTES = {
  LOGIN: "/login",
  CHAT: "/chat",
  CHAT_ID: "/chat/:chatId",
  HIRING_REQUESTS: "/hiring-requests",
  HIRING_REQUESTS_ID: "/hiring-requests/:id",
  BOOK_SLOT: "/book-slot",
  BOOK_SLOT_ID: "/book-slot/:formId",
  RATE_CANDIDATE: "/rate-candidate",
  RATE_CANDIDATE_ID: "/rate-candidate/:reviewFormId",
  ADMIN_USERS: "/admin/users",
  ADMIN_SETTINGS: "/admin/settings",
} as const;
