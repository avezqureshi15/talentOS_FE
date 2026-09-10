import type { ReactNode } from "react";

export type FilterPopoverProps = {
  children: ReactNode;
  label?: string;
  icon?: string;
  activeCount?: number;
  disabled?: boolean;
  className?: string;
};
