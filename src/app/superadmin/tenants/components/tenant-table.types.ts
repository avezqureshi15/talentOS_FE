import type { Tenant } from "@/app/superadmin/tenants/services/tenants.service";

export type TenantTableProps = {
  tenants: Tenant[];
  loading: boolean;
  onEdit: (tenant: Tenant) => void;
  onDelete: (tenant: Tenant) => void;
  onApprove: (tenant: Tenant) => void;
  onReject: (tenant: Tenant) => void;
};