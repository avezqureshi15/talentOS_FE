import type { ApiKeyCreatedResponse } from "@/app/superadmin/apps/services/apps.service.types";

export type RotateKeyDialogProps = {
  open: boolean;
  appName: string;
  onClose: () => void;
  onConfirm: () => Promise<ApiKeyCreatedResponse>;
};
