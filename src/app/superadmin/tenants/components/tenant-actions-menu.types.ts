import type { Tenant } from "@/app/superadmin/tenants/services/tenants.service";

export type TenantAction = "approve" | "reject" | "edit" | "suspend" | "reactivate";

export type TenantActionsMenuProps = {
  tenant: Tenant;
  busy: boolean;
  onApprove: (action: TenantAction) => void;
  onReject: (action: TenantAction) => void;
  onEdit: (action: TenantAction) => void;
  onSuspend: (action: TenantAction) => void;
  onReactivate: (action: TenantAction) => void;
};