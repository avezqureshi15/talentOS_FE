import { useState } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import { useCreateRole } from "../hooks/use-create-role";
import "./create-role-modal.css";

type Props = {
  open: boolean;
  onClose: () => void;
};

const ROLE_NAME_PATTERN = /^[a-z][a-z0-9_]*$/;

export default function CreateRoleModal({ open, onClose }: Props) {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const createMutation = useCreateRole();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = roleName.trim();
    if (!trimmed) { setError("Role name is required"); return; }
    if (!ROLE_NAME_PATTERN.test(trimmed)) {
      setError("Role name must start with a letter and contain only lowercase letters, numbers, or underscores");
      return;
    }
    createMutation.mutate(
      { roleName: trimmed, description: description.trim() || undefined },
      {
        onSuccess: () => {
          setRoleName("");
          setDescription("");
          setError("");
          onClose();
        },
        onError: (err: Error) => {
          setError(err.message || "Failed to create role");
        },
      }
    );
  };

  return (
    <BaseModal open={open} onClose={onClose} title="Create New Role" icon="bx bx-plus-circle">
      <form className="crm-form" onSubmit={handleSubmit}>
        <div className="crm-field">
          <label className="crm-label">
            Role Name
            <span className="crm-required" aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            className="crm-input"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="e.g. hiring_manager"
            autoFocus
          />
          <p className="crm-hint">Lowercase letters, numbers, and underscores only</p>
        </div>
        <div className="crm-field">
          <label className="crm-label">Description</label>
          <textarea
            className="crm-input crm-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this role responsible for?"
            rows={3}
          />
        </div>
        {error && <p className="crm-error">{error}</p>}
        <div className="crm-actions">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" loading={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create Role"}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
