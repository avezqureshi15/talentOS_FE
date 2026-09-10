import type { CreateAppRequest, AppCreatedResponse } from "@/app/superadmin/apps/services/apps.service.types";

export type TenantOption = {
  id: number;
  name: string;
};

export type CreateAppModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (body: CreateAppRequest) => Promise<AppCreatedResponse>;
  tenants?: TenantOption[];
};
