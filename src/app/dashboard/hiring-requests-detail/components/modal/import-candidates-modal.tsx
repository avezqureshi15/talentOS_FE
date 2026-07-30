import { useCallback, useRef, useState } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import { useImportCandidates } from "@/app/dashboard/hiring-requests-detail/hooks/use-import-candidates";
import { IMPORT_MODAL, IMPORT_FILE_ACCEPT } from "./import-candidates-modal.constants";
import type { ImportCandidatesModalProps, ImportResult } from "./import-candidates-modal.types";
import "./import-candidates-modal.css";

type Step = "upload" | "preview" | "done";

export default function ImportCandidatesModal({
  open,
  onClose,
  hiringRequestId,
}: ImportCandidatesModalProps) {
  const { parsedRows, parseFile, uploadFile, isUploading, error, clear } =
    useImportCandidates(hiringRequestId);

  const [step, setStep] = useState<Step>("upload");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      parseFile(file);
      setStep("preview");
      setResult(null);
    },
    [parseFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleImport = useCallback(async () => {
    const res = await uploadFile();
    if (res) {
      setResult(res);
      setStep("done");
    }
  }, [uploadFile]);

  const handleClose = useCallback(() => {
    clear();
    setStep("upload");
    setResult(null);
    onClose();
  }, [clear, onClose]);

  const handleImportAnother = useCallback(() => {
    clear();
    setStep("upload");
    setResult(null);
  }, [clear]);

  const validCount = parsedRows.filter((r) => r.valid).length;
  const invalidCount = parsedRows.filter((r) => !r.valid).length;

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title={IMPORT_MODAL.TITLE}
      icon={IMPORT_MODAL.ICON}
      className="import-candidates-modal"
    >
      <div className="import-body">
        {step === "upload" && (
          <><div
            className={`import-dropzone${dragOver ? " drag-over" : ""}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <i className={`bx bx-file-plus import-dropzone-icon`}></i>
            <h4>{IMPORT_MODAL.DROPZONE_TEXT}</h4>
            <p>{IMPORT_MODAL.DROPZONE_HINT}</p>
            <input
              ref={inputRef}
              type="file"
              accept={IMPORT_FILE_ACCEPT}
              style={{ display: "none" }}
              onChange={handleInputChange}
            />
          </div>
          <div className="import-column-guide">
            <span className="import-column-guide-label">Expected columns:</span>
            <div className="import-column-guide-tags">
              {IMPORT_MODAL.EXPECTED_COLUMNS.map((col) => (
                <span key={col} className="import-column-tag">{col}</span>
              ))}
            </div>
          </div></>
        )}

        {step === "preview" && (
          <>
            <div className="import-preview-header">
              <h3>Preview ({parsedRows.length} candidates)</h3>
              {invalidCount > 0 && (
                <span style={{ color: "var(--error, #d92d20)" }}>
                  {invalidCount} invalid
                </span>
              )}
            </div>
            {parsedRows.length > 0 && (
              <table className="import-preview-table">
                <thead>
                  <tr>
                    {IMPORT_MODAL.TABLE_HEADERS.map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.map((row) => (
                    <tr key={row.row} className={row.valid ? "" : "invalid"}>
                      <td>{row.row}</td>
                      <td title={row.name}>{row.name}</td>
                      <td title={row.email}>{row.email}</td>
                      <td title={row.phone}>{row.phone || "—"}</td>
                      <td title={row.resume_url}>
                        {row.resume_url ? (
                          <a href={row.resume_url} target="_blank" rel="noopener noreferrer">
                            {row.resume_url.length > 30
                              ? row.resume_url.slice(0, 30) + "..."
                              : row.resume_url}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        <span className={`status-badge ${row.valid ? "valid" : "invalid"}`}>
                          {row.valid ? IMPORT_MODAL.STATUS_VALID : IMPORT_MODAL.STATUS_INVALID}
                        </span>
                      </td>
                      <td style={{ color: row.valid ? "var(--text-muted)" : "var(--danger-light)", fontSize: 11 }}>
                        {row.reason || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {error && <div className="import-error-message">{error}</div>}
          </>
        )}

        {step === "done" && result && (
          <div className="import-preview-header" style={{ marginTop: 0 }}>
            <div>
              <h3>{IMPORT_MODAL.SUCCESS_MESSAGE}</h3>
              <div className="import-summary" style={{ marginTop: 8 }}>
                <strong>{result.created}</strong> created
                {result.skipped > 0 && (
                  <span>, <strong>{result.skipped}</strong> skipped (duplicates)</span>
                )}
                {result.errors.length > 0 && (
                  <span>, <strong>{result.errors.filter(e => e.row > 0).length}</strong> errors</span>
                )}
              </div>
              {result.errors.filter(e => !e.reason.startsWith("Duplicate")).length > 0 && (
                <div className="import-error-message" style={{ marginTop: 12 }}>
                  {result.errors.filter(e => !e.reason.startsWith("Duplicate")).map((e, i) => (
                    <div key={i}>Row {e.row}: {e.reason}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="import-footer">
        {step === "upload" && (
          <div className="import-summary">
            {IMPORT_MODAL.DROPZONE_HINT}
          </div>
        )}

        {(step === "preview" || step === "done") && (
          <div className="import-summary">
            {step === "preview" && (
              <>
                <strong>{validCount}</strong> valid out of <strong>{parsedRows.length}</strong>
              </>
            )}
            {step === "done" && result && (
              <>
                <strong>{result.created + result.skipped}</strong> of <strong>{result.total}</strong> processed
              </>
            )}
          </div>
        )}

        <div className="actions">
          {step === "upload" && (
            <button className="ghost" onClick={handleClose}>
              {IMPORT_MODAL.CANCEL_LABEL}
            </button>
          )}
          {step === "preview" && (
            <>
              <button className="ghost" onClick={handleClose}>
                {IMPORT_MODAL.CANCEL_LABEL}
              </button>
              <button
                className="primary"
                disabled={validCount === 0 || isUploading}
                onClick={handleImport}
              >
                {isUploading ? IMPORT_MODAL.IMPORTING_LABEL : IMPORT_MODAL.IMPORT_LABEL}
              </button>
            </>
          )}
          {step === "done" && (
            <>
              <button className="ghost" onClick={handleClose}>
                {IMPORT_MODAL.CLOSE_LABEL}
              </button>
              <button className="btn-success" onClick={handleImportAnother}>
                {IMPORT_MODAL.IMPORT_ANOTHER}
              </button>
            </>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
