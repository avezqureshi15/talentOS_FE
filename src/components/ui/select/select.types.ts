import type { SelectHTMLAttributes } from "react";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectSize = "sm" | "md" | "lg";

export type SelectVariant = "primary" | "secondary" | "danger" | "ghost" | "text";

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children" | "size"> & {
  options: SelectOption[];
  placeholder?: string;
  loading?: boolean;
  error?: string;
  size?: SelectSize;
  variant?: SelectVariant;
  clearable?: boolean;
  /** future: enables text search within options */
  searchable?: boolean;
  /** future: enables multi-selection */
  multiSelect?: boolean;
};
