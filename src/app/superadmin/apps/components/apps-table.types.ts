import type { AppResponse } from "@/app/superadmin/apps/services/apps.service.types";

export type AppsTableProps = {
  apps: AppResponse[];
  loading: boolean;
  onRevoke: (app: AppResponse) => void;
  onRotate: (app: AppResponse) => void;
  onEdit: (app: AppResponse) => void;
  onDelete: (app: AppResponse) => void;
  onRowClick: (app: AppResponse) => void;
  showTenant?: boolean;
};
