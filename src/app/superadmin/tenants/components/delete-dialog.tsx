import { useState } from "react";
import Button from "@/components/ui/button/button";
import { deleteTenant } from "@/app/superadmin/tenants/services/tenants.service";
import { getApiErrorMessage } from "@/utils/api-error";
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
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to suspend tenant"));
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
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirm} loading={submitting}>
            {submitting ? "Suspending..." : "Suspend"}
          </Button>
        </div>
      </div>
    </div>
  );
}
