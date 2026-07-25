import { useState } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import { deactivateUser, type AdminUser } from "@/app/admin/users/services/users-admin.service";
import "./admin-modal.css";

type Props = {
  user: AdminUser;
  onClose: () => void;
  onSuccess: () => void;
  tenantId?: number;
};

export default function DeactivateDialog({ user, onClose, onSuccess, tenantId }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      await deactivateUser(user.id, tenantId);
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to deactivate user";
      setError(msg);
    }
    setLoading(false);
  };

  return (
    <BaseModal open title="Deactivate User" onClose={onClose}>
      <div className="admin-modal-form">
        <p className="admin-confirm-text">
          Are you sure you want to deactivate <strong>{user.name}</strong> ({user.email})?
          They will no longer be able to access the platform.
        </p>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-modal-actions">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirm} loading={loading}>
            {loading ? "Deactivating..." : "Deactivate"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
