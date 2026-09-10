import { useState } from "react";
import Button from "@/components/ui/button/button";
import { deleteTenant } from "@/app/superadmin/tenants/services/tenants.service";
import { getApiErrorMessage } from "@/utils/api-error";
import type { PermanentDeleteTenantDialogProps } from "./permanent-delete-dialog.types";

export default function PermanentDeleteTenantDialog({
  tenant,
  onClose,
  onSuccess,
}: PermanentDeleteTenantDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmName, setConfirmName] = useState("");
  const nameMatches = confirmName.trim() === tenant.name;

  const handleConfirm = async () => {
    if (!nameMatches) return;
    setSubmitting(true);
    setError(null);
    try {
      await deleteTenant(tenant.id);
      onSuccess();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to delete tenant"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-content--sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Delete Tenant</h2>
          <button className="modal-close" onClick={onClose} type="button">&times;</button>
        </div>
        <div className="modal-body">
          {error && <div className="modal-error">{error}</div>}
          <p>
            Are you sure you want to permanently delete <strong>{tenant.name}</strong>?
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 8 }}>
            All users in this organization will lose access and cannot be invited back. This cannot be undone.
          </p>
          <label className="delete-confirm-label">
            Type <strong>{tenant.name}</strong> to confirm
            <input
              className="delete-confirm-input"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              autoComplete="off"
              autoFocus
            />
          </label>
        </div>
        <div className="modal-footer">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirm} loading={submitting} disabled={!nameMatches}>
            {submitting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
