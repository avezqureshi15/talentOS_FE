export const API_KEYS_QUERY_KEYS = {
  LIST: "api-keys-list",
  MANAGEABLE: "api-keys-manageable",
} as const;

export const API_KEYS_SAVE_LABEL = "Save changes";
export const API_KEYS_CLEAR_LABEL = "Clear";
export const API_KEYS_SOURCE_TENANT = "Tenant override";
export const API_KEYS_SOURCE_PLATFORM = "Platform default (.env)";
export const API_KEYS_SOURCE_PLATFORM_GLOBAL = "Platform (global)";
export const API_KEYS_EMPTY_PLACEHOLDER = "Not set — platform default will be used";
export const API_KEYS_PLATFORM_SECTION_TITLE = "Platform (global)";
export const API_KEYS_PLATFORM_SECTION_HINT =
  "Applies to the entire platform — used by inbound callbacks and background jobs that have no tenant context.";
export const API_KEYS_TENANT_SECTION_TITLE = "Tenant override";
export const API_KEYS_TENANT_SECTION_HINT =
  "Per-tenant overrides. Empty = platform default is used.";
export const API_KEYS_SAVED_MESSAGE = "API keys saved";
export const API_KEYS_ERROR_MESSAGE = "Failed to save API keys";
export const API_KEYS_PAGE_TITLE = "API Keys";
export const API_KEYS_PAGE_SUBTITLE = "Manage secrets and connection URLs for integrated services. Secrets are encrypted at rest.";
