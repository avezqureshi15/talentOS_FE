export type RevokeAppDialogProps = {
  open: boolean;
  appName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};
