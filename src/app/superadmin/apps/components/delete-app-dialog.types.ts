export type DeleteAppDialogProps = {
  open: boolean;
  appName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};