import type { HiringRequest, HiringRequestsFilters } from "@/services/hiring-requests/hiring-requests.types";

export type HiringRequestsTableProps = {
  filters: HiringRequestsFilters;
  data: HiringRequest[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onFilterChange: (patch: Partial<HiringRequestsFilters>) => void;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
};
