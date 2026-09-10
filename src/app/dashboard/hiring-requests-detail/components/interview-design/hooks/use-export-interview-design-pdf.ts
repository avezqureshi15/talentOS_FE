import { useState } from "react";
import { exportInterviewDesignPdf } from "@/services/questions/questions";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";
import type { InterviewDesignExportKind } from "../export/export-kinds";

export const useExportInterviewDesignPdf = (hiringRequestId: string, fallbackTitle: string) => {
  const [exportingKind, setExportingKind] = useState<InterviewDesignExportKind | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExport = async (kind: InterviewDesignExportKind = "all") => {
    if (!hiringRequestId) {
      const message = "Missing hiring request id";
      setExportError(message);
      useToastStore.getState().addToast(message, ToastType.ERROR);
      return;
    }

    setExportingKind(kind);
    setExportError(null);
    try {
      const { blob, filename } = await exportInterviewDesignPdf(hiringRequestId, kind);
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
      setExportingKind(null);
    }
  };

  return {
    handleExport,
    exportingKind,
    isExporting: exportingKind !== null,
    exportError,
  };
};
