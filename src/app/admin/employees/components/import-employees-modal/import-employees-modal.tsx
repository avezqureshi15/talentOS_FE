import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import { useImportEmployees } from "@/app/admin/employees/hooks/use-import-employees";
import {
  IMPORT_EMPLOYEES_ACCEPT,
  IMPORT_EMPLOYEES_LABELS,
} from "@/app/admin/employees/components/import-employees-modal/import-employees-modal.constants";
import "./import-employees-modal.css";

type ImportEmployeesModalProps = {
  open: boolean;
  onClose: () => void;
};

const ImportEmployeesModal = ({ open, onClose }: ImportEmployeesModalProps) => {
  const {
    file,
    result,
    isDownloadingTemplate,
    isImporting,
    handleFileChange,
    handleImport,
    handleDownloadTemplate,
    reset,
  } = useImportEmployees();

  const handleClose = (): void => {
    reset();
    onClose();
  };

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title={IMPORT_EMPLOYEES_LABELS.TITLE}
      icon={IMPORT_EMPLOYEES_LABELS.ICON}
      className="import-employees-modal"
    >
      {!result ? (
        <div className="iem-step">
          <p className="iem-description">{IMPORT_EMPLOYEES_LABELS.DESCRIPTION}</p>

          <div className="iem-template-row">
            <Button
              variant="secondary"
              size="md"
              icon="bx bx-download"
              onClick={handleDownloadTemplate}
              loading={isDownloadingTemplate}
              loadingText={IMPORT_EMPLOYEES_LABELS.DOWNLOADING}
            >
              {IMPORT_EMPLOYEES_LABELS.DOWNLOAD_TEMPLATE}
            </Button>
          </div>

          <label className={`iem-dropzone${file ? " iem-dropzone--filled" : ""}`}>
            <input type="file" accept={IMPORT_EMPLOYEES_ACCEPT} onChange={handleFileChange} />
            {file ? (
              <>
                <i className="bx bx-file" />
                <span className="iem-file-name">{file.name}</span>
              </>
            ) : (
              <>
                <i className="bx bx-upload" />
                <span>{IMPORT_EMPLOYEES_LABELS.CHOOSE_FILE}</span>
              </>
            )}
          </label>

          <div className="iem-actions">
            <Button variant="ghost" onClick={handleClose}>
              {IMPORT_EMPLOYEES_LABELS.CANCEL}
            </Button>
            <Button
              variant="primary"
              onClick={handleImport}
              disabled={!file}
              loading={isImporting}
              loadingText={IMPORT_EMPLOYEES_LABELS.IMPORTING}
            >
              {IMPORT_EMPLOYEES_LABELS.IMPORT}
            </Button>
          </div>
        </div>
      ) : (
        <div className="iem-step">
          <div className="iem-summary-grid">
            <div className="iem-summary-item">
              <span className="iem-summary-value">{result.total}</span>
              <span className="iem-summary-label">{IMPORT_EMPLOYEES_LABELS.TOTAL}</span>
            </div>
            <div className="iem-summary-item">
              <span className="iem-summary-value iem-summary-value--success">{result.imported}</span>
              <span className="iem-summary-label">{IMPORT_EMPLOYEES_LABELS.IMPORTED}</span>
            </div>
            <div className="iem-summary-item">
              <span className="iem-summary-value iem-summary-value--warning">{result.skipped_duplicates}</span>
              <span className="iem-summary-label">{IMPORT_EMPLOYEES_LABELS.SKIPPED}</span>
            </div>
            <div className="iem-summary-item">
              <span className="iem-summary-value iem-summary-value--danger">{result.failed.length}</span>
              <span className="iem-summary-label">{IMPORT_EMPLOYEES_LABELS.FAILED}</span>
            </div>
          </div>

          {result.failed.length > 0 && (
            <div className="iem-errors">
              {result.failed.map((err) => (
                <div className="iem-error-row" key={`${err.row}-${err.error}`}>
                  <span className="iem-error-row__row">
                    {IMPORT_EMPLOYEES_LABELS.ROW} {err.row}
                  </span>
                  <span className="iem-error-row__msg">{err.error}</span>
                </div>
              ))}
            </div>
          )}

          <div className="iem-actions">
            <Button variant="primary" onClick={handleClose}>
              {IMPORT_EMPLOYEES_LABELS.DONE}
            </Button>
          </div>
        </div>
      )}
    </BaseModal>
  );
};

export default ImportEmployeesModal;
