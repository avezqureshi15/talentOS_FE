export const HEADER_TOOLBAR_TITLE = "Applications";
export const HEADER_SEARCH_PLACEHOLDER = "Search candidates...";
export const HEADER_HAMBURGER_TITLE = "Ctrl+Shift+S";

export const HEADER_VIEW_OPTIONS = [
  { key: "board", label: "Decision Board", icon: "bx bx-columns" },
  { key: "pipeline", label: "Pipeline", icon: "bx bx-filter" },
] as const;

export const HEADER_DEFAULT_VIEW = "pipeline";

export const HEADER_EXPORT_LABEL = "Export";
export const HEADER_EXPORT_ICON = "bx-archive-arrow-down";
export const HEADER_EXPORT_TOOLTIP = ["Export candidates", "Download the candidate list for this job as an Excel file."];

export const HEADER_IMPORT_LABEL = "Import";
export const HEADER_IMPORT_ICON = "bx bx-archive-arrow-up";
export const HEADER_IMPORT_TOOLTIP = ["Import candidates", "Bulk-add candidates from an Excel template."];
export const HEADER_IMPORT_FILENAME = "candidates_template.xlsx";

export const HEADER_REFRESH_LABEL = "Refresh";
export const HEADER_REFRESH_ICON = "bx bx-refresh-cw-alt";

export const HEADER_EXPORT_FILENAME = "Hiring Request";
