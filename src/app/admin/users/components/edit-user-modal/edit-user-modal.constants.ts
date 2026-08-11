export const EDIT_USER_LABELS = {
  TITLE: (name: string) => `Edit User: ${name}`,
  NAME: "Name",
  ROLE: "Role",
  ACTIVE: "Active",
  PASSWORD: "New Password (leave blank to keep current)",
  PASSWORD_PLACEHOLDER: "Min. 8 characters",
  CANCEL: "Cancel",
  SAVE: "Save Changes",
  SAVING: "Saving...",
  NAME_REQUIRED: "Name is required",
  ERROR_FALLBACK: "Failed to update user",
} as const;
