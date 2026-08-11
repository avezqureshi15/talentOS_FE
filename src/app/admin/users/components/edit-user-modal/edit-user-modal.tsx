import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import Select from "@/components/ui/select/select";
import { ROLE_OPTIONS } from "@/constants/role-options";
import { useEditUser } from "./use-edit-user";
import { EDIT_USER_LABELS } from "./edit-user-modal.constants";
import type { EditUserModalProps } from "./edit-user-modal.types";
import "./edit-user-modal.css";

export default function EditUserModal({ user, onClose, onSuccess, tenantId }: EditUserModalProps) {
  const {
    name,
    setName,
    role,
    setRole,
    isActive,
    setIsActive,
    password,
    setPassword,
    error,
    isSubmitting,
    submit,
  } = useEditUser({ user, tenantId, onSuccess });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submit();
  };

  return (
    <BaseModal open title={EDIT_USER_LABELS.TITLE(user.name)} onClose={onClose}>
      <form className="admin-modal-form" onSubmit={handleSubmit}>
        <div className="admin-field">
          <label className="admin-label">
            {EDIT_USER_LABELS.NAME}
            <span className="admin-required" aria-hidden="true">
              *
            </span>
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
          <label className="admin-label">{EDIT_USER_LABELS.ROLE}</label>
          <Select options={ROLE_OPTIONS} value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        <div className="admin-field">
          <label className="admin-label">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="admin-checkbox"
            />
            {EDIT_USER_LABELS.ACTIVE}
          </label>
        </div>
        <div className="admin-field">
          <label className="admin-label">{EDIT_USER_LABELS.PASSWORD}</label>
          <input
            type="password"
            className="admin-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={EDIT_USER_LABELS.PASSWORD_PLACEHOLDER}
          />
        </div>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-modal-actions">
          <Button variant="ghost" onClick={onClose}>
            {EDIT_USER_LABELS.CANCEL}
          </Button>
          <Button variant="primary" type="submit" loading={isSubmitting}>
            {isSubmitting ? EDIT_USER_LABELS.SAVING : EDIT_USER_LABELS.SAVE}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
