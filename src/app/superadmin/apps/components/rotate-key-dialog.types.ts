import type { AppCreatedResponse } from "@/app/superadmin/apps/services/apps.service.types";

export type RotateKeyDialogProps = {
  open: boolean;
  appName: string;
  onClose: () => void;
  onConfirm: () => Promise<AppCreatedResponse>;
};
