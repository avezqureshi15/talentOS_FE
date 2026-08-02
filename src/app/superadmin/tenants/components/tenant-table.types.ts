import type { Tenant } from "@/app/superadmin/tenants/services/tenants.service";

export type TenantTableProps = {
  tenants: Tenant[];
  loading: boolean;
  busyTenantId: number | null;
  onEdit: (tenant: Tenant) => void;
  onSuspend: (tenant: Tenant) => void;
  onApprove: (tenant: Tenant) => void;
  onReject: (tenant: Tenant) => void;
  onReactivate: (tenant: Tenant) => void;
  onRowClick?: (tenant: Tenant) => void;
};