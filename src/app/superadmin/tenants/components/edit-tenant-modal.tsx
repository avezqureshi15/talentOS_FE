import { useState } from "react";
import Button from "@/components/ui/button/button";
import { updateTenant } from "@/app/superadmin/tenants/services/tenants.service";
import type { EditTenantModalProps } from "./edit-tenant-modal.types";

export default function EditTenantModal({ tenant, onClose, onSuccess }: EditTenantModalProps) {
  const [name, setName] = useState(tenant.name);
  const [verificationStatus, setVerificationStatus] = useState(tenant.verification_status);
  const [isActive, setIsActive] = useState(tenant.is_active);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      await updateTenant(tenant.id, {
        name: name.trim() !== tenant.name ? name.trim() : undefined,
        verification_status: verificationStatus !== tenant.verification_status ? verificationStatus : undefined,
        is_active: isActive !== tenant.is_active ? isActive : undefined,
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Failed to update tenant");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Tenant</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="modal-error">{error}</div>}
            <div className="modal-field">
              <label>Organization Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="modal-field">
              <label>Verification Status</label>
              <select value={verificationStatus} onChange={(e) => setVerificationStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="modal-field">
              <label>Active</label>
              <select value={isActive ? "true" : "false"} onChange={(e) => setIsActive(e.target.value === "true")}>
                <option value="true">Active</option>
                <option value="false">Suspended</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit" loading={submitting}>
              {submitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
