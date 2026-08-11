import { useState } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import Select from "@/components/ui/select/select";
import { updateUser, type AdminUser } from "@/app/admin/users/services/users-admin.service";
import { ROLE_OPTIONS } from "@/constants/role-options";
import "./admin-modal.css";

type Props = {
  user: AdminUser;
  onClose: () => void;
  onSuccess: () => void;
  tenantId?: number;
};

export default function EditUserModal({ user, onClose, onSuccess, tenantId }: Props) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [isActive, setIsActive] = useState(user.is_active);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Name is required");
      return;
    }
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {};
      if (trimmedName !== user.name) payload.name = trimmedName;
      if (role !== user.role) payload.role = role;
      if (isActive !== user.is_active) payload.is_active = isActive;
      if (password) payload.password = password;
      if (tenantId) payload.tenant_id = tenantId;
      await updateUser(user.id, payload);
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update user";
      setError(msg);
    }
    setLoading(false);
  };

  return (
    <BaseModal open title={`Edit User: ${user.name}`} onClose={onClose}>
      <form className="admin-modal-form" onSubmit={handleSubmit}>
        <div className="admin-field">
          <label className="admin-label">
            Name
            <span className="admin-required" aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            className="admin-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
          />
        </div>
        <div className="admin-field">
          <label className="admin-label">Role</label>
          <Select options={ROLE_OPTIONS} value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        <div className="admin-field">
          <label className="admin-label">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="admin-checkbox" />
            Active
          </label>
        </div>
        <div className="admin-field">
          <label className="admin-label">New Password (leave blank to keep current)</label>
          <input type="password" className="admin-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" />
        </div>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-modal-actions">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" loading={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
