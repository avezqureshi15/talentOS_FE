export const IMPORT_MODAL = {
  TITLE: "Import Candidates",
  ICON: "bx bx-file-plus",
  DROPZONE_TEXT: "Drop your file here or click to browse",
  DROPZONE_HINT: "Supports .xlsx, .xls, .csv — max 50 candidates",
  IMPORT_LABEL: "Import",
  IMPORTING_LABEL: "Importing...",
  CANCEL_LABEL: "Cancel",
  CLOSE_LABEL: "Close",
  EXPECTED_COLUMNS: ["Name", "Email", "Phone", "Resume URL"],
  TABLE_HEADERS: ["#", "Name", "Email", "Phone", "Resume URL", "Status", "Reason"],
  STATUS_VALID: "Valid",
  STATUS_INVALID: "Invalid",
  MAX_ROWS: 50,
  SUCCESS_MESSAGE: "Candidates imported successfully!",
  IMPORT_ANOTHER: "Import Another",
} as const;

export const IMPORT_FILE_ACCEPT = ".xlsx,.xls,.csv";
