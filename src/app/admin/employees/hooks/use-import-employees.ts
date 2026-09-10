import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/constants";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";
import {
  downloadEmployeesTemplate,
  importEmployeesFromExcel,
} from "@/app/admin/employees/services/employees.service";
import { IMPORT_EMPLOYEES_LABELS } from "@/app/admin/employees/components/import-employees-modal/import-employees-modal.constants";
import type { EmployeeImportSummary } from "@/app/admin/employees/pages/employees-page.types";

const triggerBrowserDownload = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

export function useImportEmployees(onDone?: () => void) {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);
  // UI-only state: currently selected file and the result of the last import.
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<EmployeeImportSummary | null>(null);

  const templateMutation = useMutation({
    mutationFn: () => downloadEmployeesTemplate(),
    onSuccess: ({ blob, filename }) => {
      triggerBrowserDownload(blob, filename || IMPORT_EMPLOYEES_LABELS.FALLBACK_TEMPLATE_FILENAME);
    },
    onError: () => {
      addToast(IMPORT_EMPLOYEES_LABELS.TOAST_TEMPLATE_ERROR, ToastType.ERROR);
    },
  });

  const importMutation = useMutation({
    mutationFn: (payload: File) => importEmployeesFromExcel(payload),
    onSuccess: (summary) => {
      setResult(summary);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMPLOYEES] });
      if (summary.imported > 0) {
        addToast(IMPORT_EMPLOYEES_LABELS.TOAST_SUCCESS(summary.imported), ToastType.SUCCESS);
      }
      if (summary.failed.length > 0) {
        addToast(IMPORT_EMPLOYEES_LABELS.TOAST_PARTIAL(summary.failed.length), ToastType.WARNING);
      }
    },
    onError: () => {
      addToast(IMPORT_EMPLOYEES_LABELS.TOAST_IMPORT_ERROR, ToastType.ERROR);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    setResult(null);
    event.target.value = "";
  };

  const handleImport = (): void => {
    if (!file) return;
    importMutation.mutate(file);
  };

  const reset = (): void => {
    setFile(null);
    setResult(null);
    onDone?.();
  };

  return {
    file,
    result,
    isDownloadingTemplate: templateMutation.isPending,
    isImporting: importMutation.isPending,
    handleFileChange,
    handleImport,
    handleDownloadTemplate: () => templateMutation.mutate(),
    reset,
  };
}
