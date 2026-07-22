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
  ROUND_DETAILS: "/hiring-requests/:id/round-details/:candidateId",
} as const;
