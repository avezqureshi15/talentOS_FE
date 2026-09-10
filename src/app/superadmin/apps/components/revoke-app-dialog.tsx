import { useState } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import type { RevokeAppDialogProps } from "./revoke-app-dialog.types";

export default function RevokeAppDialog({ open, appName, onClose, onConfirm }: RevokeAppDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BaseModal open={open} onClose={onClose} title="Revoke App" icon="bx bx-error-circle">
      <div className="ap-modal-body">
        <p>
          Are you sure you want to revoke <strong>{appName}</strong>?
        </p>
        <p className="ap-warning-text">
          All API requests using this key will immediately stop working.
        </p>
      </div>
      <div className="ap-modal-footer">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={handleConfirm} loading={submitting}>
          {submitting ? "Revoking..." : "Revoke"}
        </Button>
      </div>
    </BaseModal>
  );
}
