export const API_KEYS_QUERY_KEYS = {
  LIST: "api-keys-list",
} as const;

export const API_KEYS_CONFIG = [
  {
    key: "RH_API_KEY",
    label: "Recruitment hub",
    icon: "bx bx-code-alt",
    hint: "Bearer key used for the Recruitment hub service (jobs, candidates, screening, interviews).",
  },
  {
    key: "SERVICE_API_KEY",
    label: "Incoming service callbacks",
    icon: "bx bx-shield-quarter",
    hint: "Shared secret the ai-recruitment-poc uses to call talentOS internal endpoints.",
  },
  {
    key: "MEETMIND_API_TOKEN",
    label: "MeetMind",
    icon: "bx bx-code-alt",
    hint: "X-API-Key used when registering Google Meet interview schedules with MeetMind.",
  },
  {
    key: "SUPABASE_SERVICE_ROLE_KEY",
    label: "Supabase Storage",
    icon: "bx bx-code-alt",
    hint: "Service-role key for downloading resumes from private Supabase Storage buckets.",
  },
  {
    key: "RESEND_API_KEY",
    label: "Resend (email)",
    icon: "bx bx-envelope",
    hint: "API key used for transactional emails.",
  },
] as const;

export const API_KEYS_SAVE_LABEL = "Save changes";
export const API_KEYS_CLEAR_LABEL = "Clear override";
export const API_KEYS_SOURCE_TENANT = "Tenant override";
export const API_KEYS_SOURCE_PLATFORM = "Platform default (.env)";
export const API_KEYS_EMPTY_PLACEHOLDER = "Not set — platform default will be used";
export const API_KEYS_SAVED_MESSAGE = "API keys saved";
export const API_KEYS_ERROR_MESSAGE = "Failed to save API keys";
export const API_KEYS_PAGE_TITLE = "API Keys";
export const API_KEYS_PAGE_SUBTITLE = "Manage secrets for connected services. Values are encrypted at rest; they are never shown in full after saving.";
