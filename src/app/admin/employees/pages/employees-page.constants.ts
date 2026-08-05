export const EMPLOYEES_PAGE_LABELS = {
  PAGE_TITLE: "Employees",
  ACTION_IMPORT: "Import Employees",
  SEARCH_PLACEHOLDER: "Search employees by name, email, or emp ID",
  EMPTY: "No employees found",
  LOAD_ERROR: "Failed to load employees",
  UNASSIGNED: "—",
  COLUMN_EMPLOYEE: "EMPLOYEE",
  COLUMN_DESIGNATION: "DESIGNATION",
  COLUMN_DEPARTMENT: "DEPARTMENT",
  COLUMN_CONTACT: "CONTACT",
  COLUMN_STATUS: "STATUS",
  LINKED_USER_BADGE: "Linked",
  DIRECTORY_ONLY_BADGE: "Directory-only",
} as const;

export const EMPLOYEES_PAGE_GRID = "2.2fr 1.4fr 1fr 1.4fr 0.9fr";
export const EMPLOYEES_PAGE_PER_PAGE = 20;
export const EMPLOYEES_SEARCH_DEBOUNCE_MS = 300;
