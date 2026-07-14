import type { ChipVariant, ChipSize } from "./chip.types";

export const CHIP_VARIANTS: Record<ChipVariant, string> = {
  success: "chip--success",
  danger: "chip--danger",
  warning: "chip--warning",
  info: "chip--info",
  neutral: "chip--neutral",
  yellow: "chip--yellow",
  primary: "chip--primary",
  secondary: "chip--secondary",
};

export const CHIP_SIZES: Record<ChipSize, string> = {
  sm: "chip--sm",
  md: "chip--md",
  lg: "chip--lg",
};
