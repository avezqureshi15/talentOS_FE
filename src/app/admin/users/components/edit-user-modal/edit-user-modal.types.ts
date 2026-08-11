import type { AdminUser } from "@/app/admin/users/services/users-admin.service";

export type EditUserModalProps = {
  user: AdminUser;
  onClose: () => void;
  onSuccess: () => void;
  tenantId?: number;
};
