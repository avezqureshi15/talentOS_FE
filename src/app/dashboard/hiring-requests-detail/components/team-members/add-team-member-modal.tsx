import { useEffect, useMemo, useState } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import { fetchUsers, type UserItem } from "@/services/users/users";
import { useAuth } from "@/app/auth/hooks/use-auth";
import { useAddTeamMember } from "./use-team-members";
import { JOB_ROLES, JOB_ROLE_LABELS, type JobRole, type JobTeamMember } from "./team-members.types";
import "./add-team-member-modal.css";

type Props = {
  open: boolean;
  onClose: () => void;
  hiringRequestId: string;
  existing: JobTeamMember[];
};

export default function AddTeamMemberModal({ open, onClose, hiringRequestId, existing }: Props) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserItem[]>([]);
  const [selected, setSelected] = useState<UserItem | null>(null);
  const [role, setRole] = useState<JobRole>("recruiter");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState("");
  const addMutation = useAddTeamMember(hiringRequestId);
  const { user } = useAuth();

  const canAssignOwners = user?.role === "account_admin" || user?.role === "superadmin";
  const roleOptions = canAssignOwners ? JOB_ROLES : JOB_ROLES.filter((r) => r !== "job_owner");

  const existingIds = useMemo(() => new Set(existing.map((m) => m.user_id)), [existing]);

  useEffect(() => {
    if (!open) return;
    setSearch("");
    setSelected(null);
    setRole("recruiter");
    setError("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoadingUsers(true);
    fetchUsers(search.trim() || undefined, 1, 100)
      .then((data) => {
        if (!cancelled) setUsers(data.data);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load users");
      })
      .finally(() => {
        if (!cancelled) setLoadingUsers(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, search]);

  const candidates = users.filter((u) => !existingIds.has(u.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      setError("Select a user to add");
      return;
    }
    addMutation.mutate(
      { user_id: selected.id, is_owner: role === "job_owner", role },
      {
        onSuccess: () => onClose(),
        onError: (err: Error) => setError(err.message || "Failed to add member"),
      }
    );
  };

  return (
    <BaseModal open={open} onClose={onClose} title="Add Team Member" icon="bx bx-user-plus">
      <form className="atm-form" onSubmit={handleSubmit}>
        <div className="atm-field">
          <label className="atm-label">Search Users</label>
          <input
            type="text"
            className="atm-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a name or email..."
            autoFocus
          />
        </div>
        <div className="atm-list">
          {loadingUsers && <p className="atm-hint">Loading users...</p>}
          {!loadingUsers && candidates.length === 0 && (
            <p className="atm-hint">No users found</p>
          )}
          {candidates.map((u) => (
            <button
              key={u.id}
              type="button"
              className={`atm-user${selected?.id === u.id ? " atm-user--selected" : ""}`}
              onClick={() => setSelected(u)}
            >
              <span className="atm-user-avatar">{u.name.charAt(0).toUpperCase()}</span>
              <span className="atm-user-info">
                <span className="atm-user-name">{u.name}</span>
                <span className="atm-user-email">{u.email}</span>
              </span>
              <i className={`bx ${selected?.id === u.id ? "bx-check-circle" : "bx-circle"}`} />
            </button>
          ))}
        </div>
        <div className="atm-field">
          <label className="atm-label">Role</label>
          <select
            className="atm-input"
            value={role}
            onChange={(e) => setRole(e.target.value as JobRole)}
          >
            {roleOptions.map((r) => (
              <option key={r} value={r}>
                {JOB_ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="atm-error">{error}</p>}
        <div className="atm-actions">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" loading={addMutation.isPending}>
            {addMutation.isPending ? "Adding..." : "Add Member"}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
