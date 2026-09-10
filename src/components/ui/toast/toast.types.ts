export enum ToastType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  title?: string;
};
