import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "text";

export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
  className?: string;
  title?: string;
  fullWidth?: boolean;
  loadingText?: string;
};
