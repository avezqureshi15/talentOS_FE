import { useState } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import { deactivateUser, type AdminUser } from "@/app/admin/users/services/users-admin.service";

type Props = {
  user: AdminUser;
  onClose: () => void;
  onSuccess: () => void;
};

export default function DeactivateDialog({ user, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      await deactivateUser(user.id);
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to deactivate user";
      setError(msg);
    }
    setLoading(false);
  };

  return (
    <BaseModal open title="Deactivate User" onClose={onClose}>
      <div style={{ padding: "0 24px 24px" }}>
        <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 20px", lineHeight: 1.5 }}>
          Are you sure you want to deactivate <strong>{user.name}</strong> ({user.email})?
          They will no longer be able to access the platform.
        </p>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-modal-actions">
          <button type="button" className="admin-btn admin-btn--cancel" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="admin-btn admin-btn--danger"
            disabled={loading}
            onClick={handleConfirm}
          >
            {loading ? "Deactivating..." : "Deactivate"}
          </button>
        </div>
      </div>

      <style>{`
        .admin-btn--danger { background: var(--danger); color: var(--text-white); }
        .admin-error { font-size: 13px; color: var(--danger); margin: 0 0 16px; padding: 8px 12px; background: var(--danger-bg); border-radius: 8px; }
        .admin-modal-actions { display: flex; justify-content: flex-end; gap: 8px; }
        .admin-btn { padding: 8px 16px; border-radius: 8px; font-size: 13px; font-family: var(--font-family); font-weight: 500; cursor: pointer; border: none; transition: opacity 0.15s; }
        .admin-btn--primary { background: var(--accent); color: var(--text-white); }
        .admin-btn--primary:disabled, .admin-btn--danger:disabled { opacity: 0.6; cursor: not-allowed; }
        .admin-btn--cancel { background: var(--bg-hover); color: var(--text-primary); }
      `}</style>
    </BaseModal>
  );
}
