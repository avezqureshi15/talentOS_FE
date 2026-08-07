import { useState } from "react";
import { exportInterviewDesignPdf } from "@/services/questions/questions";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";

export const useExportInterviewDesignPdf = (hiringRequestId: string, fallbackTitle: string) => {
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
      const { blob, filename } = await exportInterviewDesignPdf(hiringRequestId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || `${fallbackTitle}_interview_design.pdf`;
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
