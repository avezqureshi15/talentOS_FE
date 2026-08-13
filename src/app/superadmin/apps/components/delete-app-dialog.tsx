import { useState } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import type { DeleteAppDialogProps } from "./delete-app-dialog.types";

export default function DeleteAppDialog({ open, appName, onClose, onConfirm }: DeleteAppDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await onConfirm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete app");
      setSubmitting(false);
    }
  };

  return (
    <BaseModal open={open} onClose={onClose} title="Delete App" icon="bx bx-trash">
      <div className="ap-modal-body">
        {error && <div className="ap-error">{error}</div>}
        <p>
          Permanently delete <strong>{appName}</strong>?
        </p>
        <p className="ap-warning-text">
          This removes the app and its permission grants forever. The key can no longer be used and this action
          cannot be undone.
        </p>
      </div>
      <div className="ap-modal-footer">
        <Button variant="ghost" onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button variant="danger" onClick={handleConfirm} loading={submitting}>
          {submitting ? "Deleting..." : "Delete Forever"}
        </Button>
      </div>
    </BaseModal>
  );
}