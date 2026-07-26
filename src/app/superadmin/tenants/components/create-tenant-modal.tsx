import { useState } from "react";
import Button from "@/components/ui/button/button";
import { createTenant } from "@/app/superadmin/tenants/services/tenants.service";
import type { CreateTenantModalProps } from "./create-tenant-modal.types";

export default function CreateTenantModal({ onClose, onSuccess }: CreateTenantModalProps) {
  const [orgName, setOrgName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !adminName.trim() || !adminEmail.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const { data } = await createTenant({
        org_name: orgName.trim(),
        admin_name: adminName.trim(),
        admin_email: adminEmail.trim(),
      });
      onSuccess({ admin_email: data.admin_email, invite_token: data.invite_token });
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Failed to create tenant");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Tenant</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="modal-error">{error}</div>}
            <div className="modal-field">
              <label>Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Acme Corp"
                required
              />
            </div>
            <div className="modal-field">
              <label>Admin Name</label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="modal-field">
              <label>Admin Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@acme.com"
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit" loading={submitting}>
              {submitting ? "Creating..." : "Create & Send Invite"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
