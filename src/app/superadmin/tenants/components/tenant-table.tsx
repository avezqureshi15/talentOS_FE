import DataTable from "@/components/ui/data-table/data-table";
import { TruncatedCell } from "@/components/shared/truncated-cell/truncated-cell";
import TenantActionsMenu from "./tenant-actions-menu";
import type { Tenant } from "@/app/superadmin/tenants/services/tenants.service";
import type { TenantTableProps } from "./tenant-table.types";

export default function TenantTable({
  tenants,
  loading,
  busyTenantId,
  onEdit,
  onSuspend,
  onApprove,
  onReject,
  onReactivate,
  onRowClick,
}: TenantTableProps) {
  return (
    <DataTable
      columns={[
        { header: "#", className: "dt-cell-num", render: (_, i) => i + 1 },
        { header: "Organization", className: "dt-cell-name", render: (t: Tenant) => <TruncatedCell text={t.name} className="dt-cell-name" /> },
        {
          header: "Status",
          render: (t: Tenant) => {
            if (!t.is_active && t.verification_status === "pending") {
              return <span className="dt-badge dt-badge--pending">Pending</span>;
            }
            if (!t.is_active && t.verification_status === "rejected") {
              return <span className="dt-badge dt-badge--inactive">Rejected</span>;
            }
            return (
              <span className={`dt-badge dt-badge--${t.is_active ? "active" : "inactive"}`}>
                {t.is_active ? "Active" : "Suspended"}
              </span>
            );
          },
        },
        { header: "Users", className: "dt-cell-muted", render: (t: Tenant) => t.user_count },
        { header: "Created", className: "dt-cell-date", render: (t: Tenant) => new Date(t.created_at).toLocaleDateString() },
        {
          header: "Actions",
          className: "dt-cell-right",
          render: (t: Tenant) => (
            <div onClick={(e) => e.stopPropagation()}>
              <TenantActionsMenu
                tenant={t}
                busy={busyTenantId === t.id}
                onEdit={() => onEdit(t)}
                onSuspend={() => onSuspend(t)}
                onApprove={() => onApprove(t)}
                onReject={() => onReject(t)}
                onReactivate={() => onReactivate(t)}
              />
            </div>
          ),
        },
      ]}
      data={tenants}
      loading={loading}
      keyExtractor={(t) => t.id}
      emptyMessage="No tenants found"
      gridTemplateColumns="40px 2fr 1fr 60px 1fr 60px"
      onRowClick={onRowClick}
    />
  );
}