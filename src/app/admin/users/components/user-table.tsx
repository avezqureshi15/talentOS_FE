import type { AdminUser } from "@/app/admin/users/services/users-admin.service";

type RoleChipVariant = "warning" | "info" | "success" | "neutral";

const ROLE_CHIP: Record<string, RoleChipVariant> = {
  superadmin: "warning",
  admin: "info",
  hr: "success",
  viewer: "neutral",
};

type Props = {
  users: AdminUser[];
  loading: boolean;
  onEdit: (user: AdminUser) => void;
  onDeactivate: (user: AdminUser) => void;
};

export default function UserTable({ users, loading, onEdit, onDeactivate }: Props) {
  if (loading) {
    return <div className="user-table-loading">Loading users...</div>;
  }

  if (users.length === 0) {
    return <div className="user-table-empty">No users found</div>;
  }

  return (
    <div className="user-table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Auth</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.id}>
              <td className="user-table-num">{i + 1}</td>
              <td className="user-table-name">{u.name}</td>
              <td className="user-table-email">{u.email}</td>
              <td>
                <span className={`user-chip user-chip--${ROLE_CHIP[u.role] || "neutral"}`}>
                  {u.role}
                </span>
              </td>
              <td>
                <span className={`user-badge user-badge--${u.is_active ? "active" : "inactive"}`}>
                  {u.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="user-table-auth">{u.auth_provider}</td>
              <td>
                <div className="user-table-actions">
                  <button className="user-table-btn" onClick={() => onEdit(u)} title="Edit user">
                    <span className="bx bx-pencil" />
                  </button>
                  {u.is_active && (
                    <button className="user-table-btn user-table-btn--danger" onClick={() => onDeactivate(u)} title="Deactivate user">
                      <span className="bx bx-x-circle" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .user-table-wrapper { overflow-x: auto; }
        .user-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .user-table th { text-align: left; padding: 12px 16px; color: var(--text-muted); font-weight: 500; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--border-subtle); }
        .user-table td { padding: 12px 16px; border-bottom: 1px solid var(--border-subtle); color: var(--text-primary); }
        .user-table tr:last-child td { border-bottom: none; }
        .user-table-num { color: var(--text-faint); width: 40px; }
        .user-table-name { font-weight: 500; }
        .user-table-email { color: var(--text-muted); }
        .user-table-auth { color: var(--text-faint); font-size: 12px; text-transform: capitalize; }
        .user-table-actions { display: flex; gap: 4px; }
        .user-table-btn { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; background: transparent; color: var(--text-muted); border-radius: 6px; cursor: pointer; font-size: 16px; }
        .user-table-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
        .user-table-btn--danger:hover { background: var(--danger-bg); color: var(--danger); }
        .user-chip { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: capitalize; }
        .user-chip--warning { background: rgba(255, 183, 77, 0.15); color: #ffb74d; }
        .user-chip--info { background: rgba(100, 181, 246, 0.15); color: #64b5f6; }
        .user-chip--success { background: rgba(129, 199, 132, 0.15); color: #81c784; }
        .user-chip--neutral { background: rgba(158, 158, 158, 0.15); color: #9e9e9e; }
        .user-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
        .user-badge--active { background: rgba(129, 199, 132, 0.15); color: #81c784; }
        .user-badge--inactive { background: rgba(239, 83, 80, 0.15); color: #ef5350; }
        .user-table-loading, .user-table-empty { padding: 48px; text-align: center; color: var(--text-muted); font-size: 14px; }
      `}</style>
    </div>
  );
}
