import { useState } from "react";
import { BE_API_BASE_URL } from "@/constants/constants";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";

export const useExportCsv = (hiringRequestId: string, title: string) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
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
      useToastStore.getState().addToast(message, ToastType.ERROR);
    } finally {
      setIsExporting(false);
    }
  };

  return { handleExport, isExporting };
};
