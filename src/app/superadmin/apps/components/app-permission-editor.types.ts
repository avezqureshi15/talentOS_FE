import type { PermissionInfo } from "@/app/superadmin/apps/services/apps.service.types";

export type AppPermissionEditorProps = {
  appName: string;
  permissions: PermissionInfo[];
  onToggle: (code: string) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
};
