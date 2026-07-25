import { useState } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import Select from "@/components/ui/select/select";
import { createInvite } from "@/app/admin/users/services/users-admin.service";
import { ROLE_OPTIONS } from "@/constants/role-options";
import "./admin-modal.css";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
  tenantId?: number;
};

export default function InviteUserModal({ onClose, onSuccess, tenantId }: Props) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("hr");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Email is required"); return; }
    setLoading(true);
    try {
      await createInvite({ email: email.trim(), role, tenant_id: tenantId });
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send invite";
      setError(msg);
    }
    setLoading(false);
  };

  return (
    <BaseModal open title="Invite User" onClose={onClose}>
      <form className="admin-modal-form" onSubmit={handleSubmit}>
        <div className="admin-field">
          <label className="admin-label">Email</label>
          <input type="email" className="admin-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="colleague@company.com" autoFocus />
        </div>
        <div className="admin-field">
          <label className="admin-label">Role</label>
          <Select options={ROLE_OPTIONS} value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-modal-actions">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" loading={loading}>
            {loading ? "Sending..." : "Send Invite"}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
