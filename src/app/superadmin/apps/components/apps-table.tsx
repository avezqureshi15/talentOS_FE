import DataTable from "@/components/ui/data-table/data-table";
import type { AppResponse } from "@/app/superadmin/apps/services/apps.service.types";
import type { AppsTableProps } from "./apps-table.types";

const STATUS_LABELS: Record<string, { badge: string; label: string }> = {
  active: { badge: "active", label: "Active" },
  revoked: { badge: "inactive", label: "Revoked" },
};

export default function AppsTable({
  apps,
  loading,
  onRevoke,
  onRotate,
  onEdit,
  onRowClick,
  showTenant = false,
}: AppsTableProps) {
  return (
    <DataTable
      columns={[
        { header: "#", render: (_, i) => i + 1 },
        { header: "App Name", render: (app) => app.name },
        {
          header: "Key",
          render: (app) => <code className="ap-key-prefix">{app.key_prefix}...</code>,
        },
        ...(showTenant
          ? [{ header: "Tenant", render: (app: AppResponse) => app.tenant_name ?? "—" }]
          : []),
        {
          header: "Status",
          render: (app) => {
            const cfg = app.is_active
              ? STATUS_LABELS.active
              : STATUS_LABELS.revoked;
            return <span className={`dt-badge dt-badge--${cfg.badge}`}>{cfg.label}</span>;
          },
        },
        { header: "Created", render: (app) => new Date(app.created_at).toLocaleDateString() },
        {
          header: "Created By",
          render: (app) => app.created_by?.name ?? app.created_by?.email ?? "—",
        },
        {
          header: "Last Used",
          render: (app) =>
            app.last_used_at
              ? new Date(app.last_used_at).toLocaleDateString()
              : "—",
        },
        {
          header: "Action",
          render: (app) => (
            <div className="dt-actions" onClick={(e) => e.stopPropagation()}>
              <button className="dt-btn" onClick={() => onEdit(app)} title="Edit app">
                <span className="bx bx-pencil" />
              </button>
              <button className="dt-btn" onClick={() => onRotate(app)} title="Rotate key">
                <span className="bx bx-rotate-cw" />
              </button>
              {app.is_active && (
                <button className="dt-btn dt-btn--danger" onClick={() => onRevoke(app)} title="Revoke app">
                  <span className="bx bx-x-circle" />
                </button>
              )}
            </div>
          ),
        },
      ]}
      data={apps}
      loading={loading}
      keyExtractor={(app) => app.id}
      emptyMessage="No apps found"
      gridTemplateColumns={showTenant ? "40px 1.4fr 1.1fr 1.1fr 0.9fr 0.9fr 1.1fr 0.9fr 80px" : "40px 1.6fr 1.3fr 0.9fr 0.9fr 1.1fr 0.9fr 80px"}
      onRowClick={onRowClick}
    />
  );
}
