import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import HiringRequestsTable from "@/app/dashboard/hiring-requests/components/table/table";
import CreateHiringRequestModal from "@/app/dashboard/hiring-requests/components/create-hiring-request-modal/create-hiring-request-modal";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import { useHiringRequests } from "@/app/dashboard/hiring-requests/hooks/use-hiring-requests";
import { PERMISSIONS } from "@/constants/permissions";
import { usePermissions } from "@/hooks/use-permissions";
import type { HiringRequestsFilters } from "@/services/hiring-requests/hiring-requests.types";
import type { HeaderConfig } from "@/store/header.store";
import { QUERY_KEYS } from "@/constants/constants";
import { ROUTES } from "@/constants/routes";
import { spring, fadeSlideUp } from "@/utils/motion";
import "./hiring-requests.css";

const HiringRequests = () => {
  const navigate = useNavigate();
  const { can } = usePermissions();

  const [createOpen, setCreateOpen] = useState(false);

  const [filters, setFilters] = useState<HiringRequestsFilters>({
    page: 1,
    per_page: 10,
    is_active: true,
  });
  const { data, isLoading, error } = useHiringRequests(filters);
  const queryClient = useQueryClient();

  const canCreate = data?.can_create ?? can(PERMISSIONS.HIRING_REQUEST_CREATE);

  const handleRetry = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HIRING_REQUESTS, filters] });
  }, [queryClient, filters]);

  const handleFilterChange = useCallback((patch: Partial<HiringRequestsFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch, page: 1 }));
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    handleFilterChange({ q: value || undefined });
  }, [handleFilterChange]);

  const handleCreated = useCallback((id: string) => {
    navigate(ROUTES.HIRING_APPLICATIONS.replace(":id", id));
  }, [navigate]);

  const headerConfig: HeaderConfig = useMemo(() => ({
    // "Hiring Requests" renamed to "Job Listings"
    title: "Job Listings",
    titleIcon: "bx bx-briefcase",
    search: {
      placeholder: "Search hiring requests...",
      shortcut: "Ctrl+K",
      value: filters.q || "",
      onChange: handleSearchChange,
    },
    actions: canCreate
      ? [
          {
            key: "create",
            label: "Create",
            icon: "bx bx-plus",
            variant: "primary",
            onClick: () => setCreateOpen(true),
          },
        ]
      : [],
  }), [filters.q, handleSearchChange, canCreate]);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handlePerPageChange = useCallback((per_page: number) => {
    setFilters((prev) => ({ ...prev, per_page, page: 1 }));
  }, []);

  return (
    <>
      <PageHeader {...headerConfig} />
      <CreateHiringRequestModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
      />
      <ErrorBoundary>
        <motion.div
          className="hiring-requests-page"
          variants={fadeSlideUp}
          initial="hidden"
          animate="visible"
          transition={spring}
        >
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
        </motion.div>
      </ErrorBoundary>
    </>
  );
};

export default HiringRequests;
