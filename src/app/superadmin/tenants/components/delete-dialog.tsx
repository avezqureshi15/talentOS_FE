import { useState } from "react";
import { deleteTenant } from "@/app/superadmin/tenants/services/tenants.service";
import type { DeleteTenantDialogProps } from "./delete-dialog.types";

export default function DeleteTenantDialog({ tenant, onClose, onSuccess }: DeleteTenantDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await deleteTenant(tenant.id);
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Failed to suspend tenant");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content--sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Suspend Tenant</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {error && <div className="modal-error">{error}</div>}
          <p>
            Are you sure you want to suspend <strong>{tenant.name}</strong>?
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 8 }}>
            All users in this organization will lose access until it is reactivated.
          </p>
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="modal-btn modal-btn--danger"
            onClick={handleConfirm}
            disabled={submitting}
          >
            {submitting ? "Suspending..." : "Suspend"}
          </button>
        </div>
      </div>
    </div>
  );
}
