export const EDIT_EMPLOYEE_LABELS = {
  TITLE: (name: string) => `Edit Employee: ${name}`,
  DESIGNATION: "Designation",
  DEPARTMENT: "Department",
  CONTACT: "Contact",
  CONTACT_PLACEHOLDER: "Phone number",
  CANCEL: "Cancel",
  SAVE: "Save Changes",
  SAVING: "Saving...",
  ERROR_FALLBACK: "Failed to update employee",
} as const;
