export const API_ENDPOINTS = {
  CHAT_CHATS: "/chat/chats",
  CHAT_MESSAGES: "/chat/messages",
  CHAT_CHAT_DELETE: "/chat/chats",
  APPLICATIONS: "/applications/",
  APPLICATIONS_BY_ID: "/applications/",
  HIRING_REQUESTS: "/hiring-requests/",
  HIRING_REQUESTS_DEPARTMENTS: "/hiring-requests/departments",
  HIRING_REQUESTS_LOCATIONS: "/hiring-requests/locations",
  HIRING_REQUESTS_TYPES: "/hiring-requests/types",
  HIRING_REQUESTS_STATUS: "/hiring-requests/:id/status",
  USERS: "/users/",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 10,
  DEFAULT_CHATS_PAGE_SIZE: 20,
  DEFAULT_CHAT_MESSAGES_LIMIT: 20,
  DEFAULT_CMD_PALETTE_PAGE_SIZE: 5,
  APPLICATIONS_PER_PAGE: 15,
  APPLICATIONS_SEARCH_SIZE: 20,
} as const;

export const FILTER_DEFAULTS = {
  ALL: "all",
} as const;
