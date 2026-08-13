import type { ReactNode, CSSProperties } from "react";

export type Column<T> = {
  header: string;
  render: (row: T, index: number) => ReactNode;
  className?: string;
  style?: CSSProperties;
  width?: string;
  /**
   * Per-column truncation limit.
   * - number  → truncate at that many characters
   * - true    → truncate at the TruncatedCell default (25 chars)
   * Only applied when render() returns a plain string.
   */
  truncate?: number | boolean;
  /** Extra class forwarded to the TruncatedCell tooltip popup. */
  truncateTooltipClassName?: string;
};

export type DataTablePagination = {
  page: number;
  total: number;
  totalPages: number;
  perPage?: number;
  onPerPageChange?: (perPage: number) => void;
  onPageChange: (page: number) => void;
};

export type DataTableSelection = {
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  allSelected: boolean;
};

export type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  loading?: boolean;
  emptyMessage?: string;
  gridTemplateColumns: string;
  onRowClick?: (row: T) => void;
  toolbar?: ReactNode;
  pagination?: DataTablePagination;
  selection?: DataTableSelection;
  error?: string | null;
  onRetry?: () => void;
  rowClassName?: (row: T, index: number) => string;
  animated?: boolean;
};
