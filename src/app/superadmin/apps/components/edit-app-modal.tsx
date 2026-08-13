import { useEffect, useState } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import type { AppResponse, UpdateAppRequest } from "@/app/superadmin/apps/services/apps.service.types";
import { API_KEY_ROLES } from "../api-key-roles";

const roleOptions = API_KEY_ROLES.map((r) => ({ value: r.value, label: r.label }));

export type EditAppModalProps = {
  open: boolean;
  app: AppResponse | null;
  onClose: () => void;
  onSubmit: (body: UpdateAppRequest) => Promise<void>;
};

const toDateInput = (iso: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

export default function EditAppModal({ open, app, onClose, onSubmit }: EditAppModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && app) {
      setName(app.name);
      setDescription(app.description ?? "");
      setRole(app.role ?? "");
      setExpiresAt(toDateInput(app.expires_at));
      setError(null);
    }
  }, [open, app]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !app) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        role: role || null,
        expires_at: expiresAt ? new Date(expiresAt + "T23:59:59").toISOString() : null,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update app");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BaseModal open={open} onClose={onClose} title="Edit App" icon="bx bx-pencil">
      <form onSubmit={handleSubmit} style={{ display: "contents" }}>
        <div className="ap-modal-body">
          {error && <div className="ap-error">{error}</div>}
          <div className="ap-field">
            <label>App Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="ap-field">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="ap-field">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">No role (platform keys only)</option>
              {roleOptions.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div className="ap-field">
            <label>Expires On <span style={{ opacity: 0.6, fontWeight: 400 }}>(optional)</span></label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
            />
          </div>
        </div>
        <div className="ap-modal-footer">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" loading={submitting}>
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
