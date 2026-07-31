import type { ApiKeyResponse } from "@/app/superadmin/apps/services/apps.service.types";

export type AppsTableProps = {
  apps: ApiKeyResponse[];
  loading: boolean;
  onRevoke: (app: ApiKeyResponse) => void;
  onRotate: (app: ApiKeyResponse) => void;
  onRowClick: (app: ApiKeyResponse) => void;
  showTenant?: boolean;
};
