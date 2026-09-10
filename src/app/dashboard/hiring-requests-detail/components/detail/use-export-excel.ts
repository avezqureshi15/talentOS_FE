import { useState } from "react";
import { exportHiringRequestExcel } from "@/services/hiring-requests/hiring-requests";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";

export const useExportExcel = (hiringRequestId: string, fallbackTitle: string) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExport = async () => {
    if (!hiringRequestId) {
      const message = "Missing hiring request id";
      setExportError(message);
      useToastStore.getState().addToast(message, ToastType.ERROR);
      return;
    }

    setIsExporting(true);
    setExportError(null);
    try {
      const { blob, filename } = await exportHiringRequestExcel(hiringRequestId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || `${fallbackTitle}_applicants.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Export failed";
      setExportError(message);
      useToastStore.getState().addToast(message, ToastType.ERROR);
    } finally {
      setIsExporting(false);
    }
  };

  return { handleExport, isExporting, exportError };
};
