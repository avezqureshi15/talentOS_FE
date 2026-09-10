import type { Tenant } from "@/app/superadmin/tenants/services/tenants.service";

export type EditTenantModalProps = {
  tenant: Tenant;
  onClose: () => void;
  onSuccess: () => void;
};