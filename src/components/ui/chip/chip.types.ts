import type { ReactNode, MouseEvent } from "react";

export type ChipVariant =
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "neutral"
  | "yellow"
  | "primary"
  | "secondary";

export type ChipSize = "sm" | "md" | "lg";

export interface ChipProps {
  children: ReactNode;
  variant?: ChipVariant;
  size?: ChipSize;
  icon?: string;
  onRemove?: (e: MouseEvent<HTMLButtonElement>) => void;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  title?: string;
}
