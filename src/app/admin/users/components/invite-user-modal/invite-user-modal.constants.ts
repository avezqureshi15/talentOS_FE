import type { InviteTab } from "./invite-user-modal.types";

export const INVITE_MODAL_LABELS = {
  TITLE: "Invite User",
  TAB_EXISTING: "Existing Employee",
  TAB_MANUAL: "Manual Email",
  EMAIL_LABEL: "Email Address",
  EMAIL_PLACEHOLDER: "colleague@company.com",
  ROLE_LABEL: "Role",
  CANCEL: "Cancel",
  SUBMIT: "Send Invite",
  SUBMITTING: "Sending...",
  SEARCH_PLACEHOLDER: "Search employees by name or email",
  NO_RESULTS: "No matching employees",
  SEARCH_HINT: "Start typing to search your directory",
  CLEAR_SELECTION: "Clear selection",
  ERR_EMAIL_REQUIRED: "Email is required",
  ERR_PICK_EMPLOYEE: "Select an employee to invite",
  ERR_GENERIC: "Failed to send invite",
  TOAST_SUCCESS: "Invitation sent successfully",
} as const;

export const INVITE_TABS: { key: InviteTab; label: string }[] = [
  { key: "existing", label: INVITE_MODAL_LABELS.TAB_EXISTING },
  { key: "manual", label: INVITE_MODAL_LABELS.TAB_MANUAL },
];

export const INVITE_SEARCH_DEBOUNCE_MS = 300;
export const INVITE_SEARCH_LIMIT = 15;
