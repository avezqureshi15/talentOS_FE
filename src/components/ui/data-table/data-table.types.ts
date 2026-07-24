import type { ReactNode, CSSProperties } from "react";

export type Column<T> = {
  header: string;
  render: (row: T, index: number) => ReactNode;
  className?: string;
  style?: CSSProperties;
  width?: string;
};

export type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  loading?: boolean;
  emptyMessage?: string;
  gridTemplateColumns: string;
};
