import type { AdminUser } from "@/app/admin/users/services/users-admin.service";

export type UserTableProps = {
  users: AdminUser[];
  loading: boolean;
  onEdit: (user: AdminUser) => void;
  onDeactivate: (user: AdminUser) => void;
  onViewJobs?: (user: AdminUser) => void;
};
