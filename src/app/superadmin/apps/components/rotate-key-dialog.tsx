import { useState } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import KeyDisplay from "./key-display";
import type { RotateKeyDialogProps } from "./rotate-key-dialog.types";

type Step = "confirm" | "result";

export default function RotateKeyDialog({ open, appName, onClose, onConfirm }: RotateKeyDialogProps) {
  const [step, setStep] = useState<Step>("confirm");
  const [fullKey, setFullKey] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRotate = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const result = await onConfirm();
      setFullKey(result.full_key);
      setStep("result");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to rotate key";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (step === "result") {
      onClose();
      return;
    }
    setStep("confirm");
    setFullKey("");
    setError(null);
    setSubmitting(false);
    onClose();
  };

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title={step === "confirm" ? "Rotate API Key" : "New Key Generated"}
      icon={step === "confirm" ? "bx bx-refresh" : "bx bx-check-shield"}
    >
      {step === "confirm" ? (
        <>
          <div className="ap-modal-body">
            {error && <div className="ap-error">{error}</div>}
            <p>
              Rotate the key for <strong>{appName}</strong>?
            </p>
            <p className="ap-warning-text">
              The current key will stop working immediately. A new key will be generated.
            </p>
          </div>
          <div className="ap-modal-footer">
            <Button variant="ghost" onClick={handleClose} disabled={submitting}>Cancel</Button>
            <Button variant="primary" onClick={handleRotate} loading={submitting}>
              {submitting ? "Rotating..." : "Rotate Key"}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="ap-modal-body">
            <KeyDisplay fullKey={fullKey} />
          </div>
          <div className="ap-modal-footer">
            <Button variant="primary" onClick={handleClose}>I've Saved My Key</Button>
          </div>
        </>
      )}
    </BaseModal>
  );
}
