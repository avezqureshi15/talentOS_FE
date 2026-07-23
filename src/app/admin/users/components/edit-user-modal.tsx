import { useState } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import { updateUser, type AdminUser } from "@/app/admin/users/services/users-admin.service";

type Props = {
  user: AdminUser;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditUserModal({ user, onClose, onSuccess }: Props) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [isActive, setIsActive] = useState(user.is_active);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {};
      if (name !== user.name) payload.name = name;
      if (role !== user.role) payload.role = role;
      if (isActive !== user.is_active) payload.is_active = isActive;
      if (password) payload.password = password;
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
          <label className="admin-label">Name</label>
          <input type="text" className="admin-input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </div>
        <div className="admin-field">
          <label className="admin-label">Role</label>
          <select className="admin-select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="hr">HR</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <div className="admin-field">
          <label className="admin-label">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} style={{ marginRight: 8 }} />
            Active
          </label>
        </div>
        <div className="admin-field">
          <label className="admin-label">New Password (leave blank to keep current)</label>
          <input type="password" className="admin-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" />
        </div>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-modal-actions">
          <button type="button" className="admin-btn admin-btn--cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <style>{`
        .admin-modal-form { padding: 0 24px 24px; }
        .admin-field { margin-bottom: 16px; }
        .admin-label { display: block; font-size: 13px; color: var(--text-secondary); margin-bottom: 6px; font-weight: 500; }
        .admin-input, .admin-select { width: 100%; padding: 10px 12px; background: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: 8px; color: var(--text-primary); font-size: 14px; font-family: var(--font-family); outline: none; box-sizing: border-box; }
        .admin-input:focus, .admin-select:focus { border-color: var(--accent); }
        .admin-select { cursor: pointer; }
        .admin-error { font-size: 13px; color: var(--danger); margin: 0 0 16px; padding: 8px 12px; background: var(--danger-bg); border-radius: 8px; }
        .admin-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 24px; }
        .admin-btn { padding: 8px 16px; border-radius: 8px; font-size: 13px; font-family: var(--font-family); font-weight: 500; cursor: pointer; border: none; transition: opacity 0.15s; }
        .admin-btn--primary { background: var(--accent); color: var(--text-white); }
        .admin-btn--primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .admin-btn--cancel { background: var(--bg-hover); color: var(--text-primary); }
      `}</style>
    </BaseModal>
  );
}
