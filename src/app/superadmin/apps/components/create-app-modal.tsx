import { useEffect, useState } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import KeyDisplay from "./key-display";
import type { CreateAppModalProps } from "./create-app-modal.types";

type Step = "form" | "result";

export default function CreateAppModal({ open, onClose, onSuccess }: CreateAppModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullKey, setFullKey] = useState("");

  useEffect(() => {
    if (open) {
      setStep("form");
      setName("");
      setDescription("");
      setError(null);
      setFullKey("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await onSuccess({ name: name.trim(), description: description.trim() || undefined });
      setFullKey(result.full_key);
      setStep("result");
    } catch (err: unknown) {
      const detail = err instanceof Error ? err.message : "Failed to create app";
      setError(detail);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setError(null);
    setStep("form");
    setFullKey("");
    onClose();
  };

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title={step === "form" ? "Create New App" : "New Key Generated"}
      icon={step === "form" ? "bx bx-code-alt" : "bx bx-check-shield"}
    >
      {step === "form" ? (
        <form onSubmit={handleSubmit} style={{ display: "contents" }}>
          <div className="ap-modal-body">
            {error && <div className="ap-error">{error}</div>}
            <div className="ap-field">
              <label>App Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Recruitment Hub"
                required
              />
            </div>
            <div className="ap-field">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description for this app"
                rows={3}
              />
            </div>
          </div>
          <div className="ap-modal-footer">
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" type="submit" loading={submitting}>
              {submitting ? "Creating..." : "Create App"}
            </Button>
          </div>
        </form>
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
