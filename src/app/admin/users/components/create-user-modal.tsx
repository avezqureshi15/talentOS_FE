import { useState } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import { createUser } from "@/app/admin/users/services/users-admin.service";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreateUserModal({ onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("hr");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Name is required"); return; }
    if (!email.trim()) { setError("Email is required"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      await createUser({ name: name.trim(), email: email.trim(), password, role });
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create user";
      setError(msg);
    }
    setLoading(false);
  };

  return (
    <BaseModal open title="Create User" onClose={onClose}>
      <form className="admin-modal-form" onSubmit={handleSubmit}>
        <div className="admin-field">
          <label className="admin-label">Full Name</label>
          <input type="text" className="admin-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" autoFocus />
        </div>
        <div className="admin-field">
          <label className="admin-label">Email</label>
          <input type="email" className="admin-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@company.com" />
        </div>
        <div className="admin-field">
          <label className="admin-label">Password</label>
          <input type="password" className="admin-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" />
        </div>
        <div className="admin-field">
          <label className="admin-label">Role</label>
          <select className="admin-select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="hr">HR</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-modal-actions">
          <button type="button" className="admin-btn admin-btn--cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
            {loading ? "Creating..." : "Create User"}
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
