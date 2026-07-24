import type { Tenant } from "@/app/superadmin/tenants/services/tenants.service";

export type DeleteTenantDialogProps = {
  tenant: Tenant;
  onClose: () => void;
  onSuccess: () => void;
};