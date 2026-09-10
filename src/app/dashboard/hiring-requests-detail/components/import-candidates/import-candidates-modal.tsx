import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";
import { QUERY_KEYS } from "@/constants/constants";
import {
  downloadImportTemplate,
  importCandidatesFromExcel,
  type ImportSummary,
} from "@/services/hiring-requests/hiring-requests";
import { HEADER_IMPORT_FILENAME } from "@/layouts/protected-layouts/components/header/header.constants";
import "./import-candidates-modal.css";

type ImportCandidatesModalProps = {
  open: boolean;
  onClose: () => void;
  hiringRequestId: string;
};

const ImportCandidatesModal = ({ open, onClose, hiringRequestId }: ImportCandidatesModalProps) => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [result, setResult] = useState<ImportSummary | null>(null);

  const handleDownloadTemplate = async () => {
    if (!hiringRequestId) return;
    setIsDownloadingTemplate(true);
    try {
      const { blob, filename } = await downloadImportTemplate(hiringRequestId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || HEADER_IMPORT_FILENAME;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      useToastStore.getState().addToast("Failed to download template", ToastType.ERROR);
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    setResult(null);
    event.target.value = "";
  };

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HIRING_REQUEST] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.APPLICATIONS] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FINAL_VERDICTS] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INTERVIEWS] });
  };

  const handleImport = async () => {
    if (!file || !hiringRequestId) return;
    setIsImporting(true);
    try {
      const summary = await importCandidatesFromExcel(hiringRequestId, file);
      setResult(summary);
      invalidateQueries();
      if (summary.imported > 0) {
        useToastStore
          .getState()
          .addToast(`${summary.imported} candidate(s) imported successfully`, ToastType.SUCCESS);
      }
      if (summary.failed.length > 0) {
        useToastStore.getState().addToast(`${summary.failed.length} row(s) failed — see details`, ToastType.WARNING);
      }
    } catch {
      useToastStore.getState().addToast("Import failed", ToastType.ERROR);
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    onClose();
  };

  return (
    <BaseModal open={open} onClose={handleClose} title="Import Candidates" icon="bx bx-upload" className="import-candidates-modal">
      {!result ? (
        <div className="icm-step">
          <p className="icm-description">
            Download the template, fill in the candidate details, and upload the file. Name, Email, Phone and Resume URL
            are required. Candidates are queued for AI evaluation after import.
          </p>

          <div className="icm-template-row">
            <Button variant="secondary" size="md" icon="bx bx-download" onClick={handleDownloadTemplate} loading={isDownloadingTemplate} loadingText="Downloading...">
              Download Template
            </Button>
          </div>

          <label className={`icm-dropzone${file ? " icm-dropzone--filled" : ""}`}>
            <input type="file" accept=".xlsx,.xlsm" onChange={handleFileChange} />
            {file ? (
              <>
                <i className="bx bx-file" />
                <span className="icm-file-name">{file.name}</span>
              </>
            ) : (
              <>
                <i className="bx bx-upload" />
                <span>Click to choose an Excel file (.xlsx)</span>
              </>
            )}
          </label>

          <div className="icm-actions">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleImport} disabled={!file} loading={isImporting} loadingText="Importing...">
              Import
            </Button>
          </div>
        </div>
      ) : (
        <div className="icm-step">
          <div className="icm-summary-grid">
            <div className="icm-summary-item">
              <span className="icm-summary-value">{result.total}</span>
              <span className="icm-summary-label">Total rows</span>
            </div>
            <div className="icm-summary-item">
              <span className="icm-summary-value icm-summary-value--success">{result.imported}</span>
              <span className="icm-summary-label">Imported</span>
            </div>
            <div className="icm-summary-item">
              <span className="icm-summary-value icm-summary-value--warning">{result.skipped_duplicates}</span>
              <span className="icm-summary-label">Skipped (duplicates)</span>
            </div>
            <div className="icm-summary-item">
              <span className="icm-summary-value icm-summary-value--danger">{result.failed.length}</span>
              <span className="icm-summary-label">Failed</span>
            </div>
          </div>

          {result.failed.length > 0 && (
            <div className="icm-errors">
              {result.failed.map((err) => (
                <div className="icm-error-row" key={`${err.row}-${err.error}`}>
                  <span className="icm-error-row__row">Row {err.row}</span>
                  <span className="icm-error-row__msg">{err.error}</span>
                </div>
              ))}
            </div>
          )}

          <div className="icm-actions">
            <Button variant="primary" onClick={handleClose}>
              Done
            </Button>
          </div>
        </div>
      )}
    </BaseModal>
  );
};

export default ImportCandidatesModal;
