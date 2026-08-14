import { useState } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import Select from "@/components/ui/select/select";
import { createUser } from "@/app/admin/users/services/users-admin.service";
import { ROLE_OPTIONS } from "@/constants/role-options";
import { isValidEmail } from "@/utils/validation";
import "./admin-modal.css";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
  tenantId?: number;
};

export default function CreateUserModal({ onClose, onSuccess, tenantId }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("recruiter");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Name is required"); return; }
    if (!email.trim()) { setError("Email is required"); return; }
    if (!isValidEmail(email)) { setError("Please enter a valid email"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      await createUser({ name: name.trim(), email: email.trim(), password, role, tenant_id: tenantId });
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
          <label className="admin-label">Full Name<span className="admin-required" aria-hidden="true">*</span></label>
          <input type="text" className="admin-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" autoFocus />
        </div>
        <div className="admin-field">
          <label className="admin-label">Email<span className="admin-required" aria-hidden="true">*</span></label>
          <input type="email" className="admin-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@company.com" />
        </div>
        <div className="admin-field">
          <label className="admin-label">Password<span className="admin-required" aria-hidden="true">*</span></label>
          <input type="password" className="admin-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" />
        </div>
        <div className="admin-field">
          <label className="admin-label">Role</label>
          <Select options={ROLE_OPTIONS} value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-modal-actions">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" loading={loading}>
            {loading ? "Creating..." : "Create User"}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
