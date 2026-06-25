import { useState } from "react";
import { BE_API_BASE_URL } from "@/constants/constants";

export const useExportCsv = (hiringRequestId: string, title: string) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      const res = await fetch(`${BE_API_BASE_URL}/hiring-requests/${hiringRequestId}/export`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}_applicants.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Export failed";
      setExportError(message);
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return { handleExport, isExporting, exportError };
};
