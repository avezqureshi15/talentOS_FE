export const IMPORT_EMPLOYEES_LABELS = {
  TITLE: "Import Employees",
  ICON: "bx bx-upload",
  DESCRIPTION:
    "Download the template, fill in the employee details, and upload the file. Employee ID, Email, and Name are required. Duplicate emp IDs or emails are skipped.",
  DOWNLOAD_TEMPLATE: "Download Template",
  DOWNLOADING: "Downloading...",
  CHOOSE_FILE: "Click to choose an Excel file (.xlsx)",
  CANCEL: "Cancel",
  IMPORT: "Import",
  IMPORTING: "Importing...",
  DONE: "Done",
  TOTAL: "Total rows",
  IMPORTED: "Imported",
  SKIPPED: "Skipped (duplicates)",
  FAILED: "Failed",
  ROW: "Row",
  TOAST_TEMPLATE_ERROR: "Failed to download template",
  TOAST_IMPORT_ERROR: "Import failed",
  TOAST_SUCCESS: (n: number) => `${n} employee(s) imported successfully`,
  TOAST_PARTIAL: (n: number) => `${n} row(s) failed — see details`,
  FALLBACK_TEMPLATE_FILENAME: "employees_template.xlsx",
} as const;

export const IMPORT_EMPLOYEES_ACCEPT = ".xlsx,.xlsm";
