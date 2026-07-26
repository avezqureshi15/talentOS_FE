import DataTable from "@/components/ui/data-table/data-table";
import type { Tenant } from "@/app/superadmin/tenants/services/tenants.service";
import type { TenantTableProps } from "./tenant-table.types";

const STATUS_CONFIG: Record<string, { badge: string; label: string }> = {
  approved: { badge: "active", label: "Approved" },
  pending: { badge: "pending", label: "Pending" },
  rejected: { badge: "inactive", label: "Rejected" },
};

export default function TenantTable({
  tenants,
  loading,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onRowClick,
}: TenantTableProps) {
  return (
    <DataTable
      columns={[
        { header: "#", render: (_, i) => i + 1 },
        { header: "Organization", render: (t: Tenant) => t.name },
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
        { header: "Users", render: (t: Tenant) => t.user_count },
        {
          header: "Verification",
          render: (t: Tenant) => {
            const cfg = STATUS_CONFIG[t.verification_status] ?? { badge: "neutral", label: t.verification_status };
            return <span className={`dt-badge dt-badge--${cfg.badge}`}>{cfg.label}</span>;
          },
        },
        { header: "Created", render: (t: Tenant) => new Date(t.created_at).toLocaleDateString() },
{
  header: "",
  render: (t: Tenant) => (
    <div className="dt-actions" onClick={(e) => e.stopPropagation()}>
      {t.verification_status === "pending" && (
        <>
          <button className="dt-btn dt-btn--success" onClick={() => onApprove(t)} title="Approve tenant">
            <span className="bx bx-check-circle" />
          </button>
          <button className="dt-btn dt-btn--danger" onClick={() => onReject(t)} title="Reject tenant">
            <span className="bx bx-x-circle" />
          </button>
        </>
      )}
      <button className="dt-btn" onClick={() => onEdit(t)} title="Edit tenant">
        <span className="bx bx-pencil" />
      </button>
      <button className="dt-btn dt-btn--danger" onClick={() => onDelete(t)} title="Suspend tenant">
        <span className="bx bx-x-circle" />
      </button>
    </div>
  ),
},
      ]}
      data={tenants}
      loading={loading}
      keyExtractor={(t) => t.id}
      emptyMessage="No tenants found"
      gridTemplateColumns="40px 2fr 1fr 60px 1fr 1fr 80px"
      onRowClick={onRowClick}
    />
  );
}
