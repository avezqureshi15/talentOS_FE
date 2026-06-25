import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import HiringRequestsTable from "@/app/dashboard/hiring-requests/components/table/table";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import { useHiringRequests } from "@/app/dashboard/hiring-requests/hooks/use-hiring-requests";
import type { HiringRequestsFilters } from "@/services/hiring-requests/hiring-requests.types";
import { QUERY_KEYS } from "@/constants/constants";
import "./hiring-requests.css";

const HiringRequests = () => {
  const [filters, setFilters] = useState<HiringRequestsFilters>({
    page: 1,
    per_page: 10,
  });
  const { data, isLoading, error } = useHiringRequests(filters);
  const queryClient = useQueryClient();

  const handleRetry = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HIRING_REQUESTS, filters] });
  }, [queryClient, filters]);

  const handleFilterChange = useCallback((patch: Partial<HiringRequestsFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handlePerPageChange = useCallback((per_page: number) => {
    setFilters((prev) => ({ ...prev, per_page, page: 1 }));
  }, []);

  if (isLoading && !data) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <ErrorBoundary>
      <div className="hiring-requests-page">
        <div className="page-heading">All Hiring Requests</div>
        <HiringRequestsTable
          filters={filters}
          data={data?.data ?? []}
          page={data?.page ?? 1}
          perPage={data?.per_page ?? 10}
          total={data?.total ?? 0}
          totalPages={data?.total_pages ?? 1}
          isLoading={isLoading}
          error={error?.message ?? null}
          onRetry={handleRetry}
          onFilterChange={handleFilterChange}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
        />
      </div>
    </ErrorBoundary>
  );
};

export default HiringRequests;
