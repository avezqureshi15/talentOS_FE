import DataTable from "@/components/ui/data-table/data-table";
import { TruncatedCell } from "@/components/shared/truncated-cell/truncated-cell";
import type { AdminUser } from "@/app/admin/users/services/users-admin.service";
import { ROLE_DISPLAY } from "@/constants/role-display";
import type { UserTableProps } from "./user-table.types";

export default function UserTable({ users, loading, onEdit, onDeactivate, onViewJobs }: UserTableProps) {
  return (
    <DataTable
      columns={[
        { header: "#", render: (_, i) => i + 1 },
        { header: "Name", render: (u: AdminUser) => <TruncatedCell text={u.name} className="dt-cell-name" /> },
        { header: "Email", render: (u: AdminUser) => <TruncatedCell text={u.email} className="dt-cell-muted" /> },
        {
          header: "Role",
          render: (u: AdminUser) => {
            const display = ROLE_DISPLAY[u.role] ?? { chipVariant: "neutral", label: u.role };
            return <span className={`dt-chip dt-chip--${display.chipVariant}`}>{display.label}</span>;
          },
        },
        {
          header: "Status",
          render: (u: AdminUser) => (
            <span className={`dt-badge dt-badge--${u.is_active ? "active" : "inactive"}`}>
              {u.is_active ? "Active" : "Inactive"}
            </span>
          ),
        },
        { header: "Auth", render: (u: AdminUser) => <TruncatedCell text={u.auth_provider} /> },
        {
          header: "",
          render: (u: AdminUser) => (
            <div className="dt-actions">
              <button
                className="dt-btn"
                onClick={(e) => { e.stopPropagation(); onEdit(u); }}
                title="Edit user"
              >
                <span className="bx bx-pencil" />
              </button>
              {u.is_active && (
                <button
                  className="dt-btn dt-btn--danger"
                  onClick={(e) => { e.stopPropagation(); onDeactivate(u); }}
                  title="Deactivate user"
                >
                  <span className="bx bx-x-circle" />
                </button>
              )}
            </div>
          ),
        },
      ]}
      data={users}
      loading={loading}
      onRowClick={onViewJobs}
      keyExtractor={(u) => u.id}
      emptyMessage="No users found"
      gridTemplateColumns="40px 1.5fr 2fr 1fr 1fr 1fr 80px"
    />
  );
}
