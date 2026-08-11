import type { ReactNode } from "react";

export type BaseModalVariant = "centered" | "slide-right";

export type BaseModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  icon?: string;
  children: ReactNode;
  variant?: BaseModalVariant;
  className?: string;
  overlayClassName?: string;
  /** When true (default), always show the close (X) control even without a title. */
  showClose?: boolean;
};
