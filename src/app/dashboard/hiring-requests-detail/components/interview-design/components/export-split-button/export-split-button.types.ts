import type { InterviewDesignExportKind } from "../../export/export-kinds";

export type ExportSplitButtonProps = {
  handleExport: (kind: InterviewDesignExportKind) => void | Promise<void>;
  exportingKind: InterviewDesignExportKind | null;
  isExporting?: boolean;
  disabled?: boolean;
};