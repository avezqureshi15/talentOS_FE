import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import {
  HEADER_REFRESH_ICON,
  HEADER_REFRESH_LABEL,
} from "@/layouts/protected-layouts/components/header/header.constants";
import SearchInput from "@/components/ui/search-input/search-input";
import DataTable from "@/components/ui/data-table/data-table";
import { useAuth } from "@/app/auth/hooks/use-auth";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/constants/permissions";
import { useEmployees } from "@/app/admin/employees/hooks/use-employees";
import { buildEmployeesColumns } from "@/app/admin/employees/pages/employees-columns";
import ImportEmployeesModal from "@/app/admin/employees/components/import-employees-modal/import-employees-modal";
import EditEmployeeModal from "@/app/admin/employees/components/edit-employee-modal/edit-employee-modal";
import {
  EMPLOYEES_PAGE_GRID,
  EMPLOYEES_PAGE_LABELS,
  EMPLOYEES_PAGE_PER_PAGE,
} from "@/app/admin/employees/pages/employees-page.constants";
import { ROUTES } from "@/constants/routes";
import type { Employee } from "@/app/admin/employees/pages/employees-page.types";
import type { HeaderConfig } from "@/store/header.store";
import "./employees-page.css";

const EmployeesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { can } = usePermissions();
  const canEdit = can(PERMISSIONS.USER_MANAGE);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const { data, isLoading, isFetching, isRefetching, isError, page, search, setPage, onSearch, refetch } =
    useEmployees();

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / EMPLOYEES_PAGE_PER_PAGE));
  const canImport = user?.role === "account_admin";

  const columns = useMemo(
    () =>
      buildEmployeesColumns({
        onEdit: canEdit ? (employee) => setEditingEmployee(employee) : undefined,
      }),
    [canEdit],
  );

  const handleRowClick = (row: Employee) => {
    navigate(ROUTES.ADMIN_EMPLOYEE_DETAIL.replace(":empId", row.emp_id));
  };

  const actions: NonNullable<HeaderConfig["actions"]> = [
    {
      key: "refresh",
      label: HEADER_REFRESH_LABEL,
      icon: isRefetching ? "bx bx-loader-alt bx-spin" : HEADER_REFRESH_ICON,
      variant: "primary",
      disabled: isRefetching,
      onClick: () => void refetch(),
    },
    ...(canImport
      ? [
          {
            key: "import-employees",
            label: EMPLOYEES_PAGE_LABELS.ACTION_IMPORT,
            variant: "primary" as const,
            icon: "bx bx-upload",
            onClick: () => setIsImportOpen(true),
          },
        ]
      : []),
  ];

  return (
    <ErrorBoundary>
      <div className="employees-page">
        <PageHeader
          title={EMPLOYEES_PAGE_LABELS.PAGE_TITLE}
          actions={actions}
        />

        <SearchInput
          className="employees-search"
          placeholder={EMPLOYEES_PAGE_LABELS.SEARCH_PLACEHOLDER}
          value={search}
          onChange={onSearch}
        />

        <div className="employees-content">
          <DataTable
            columns={columns}
            data={data?.data ?? []}
            keyExtractor={(e) => e.id}
            loading={isLoading || isFetching}
            emptyMessage={EMPLOYEES_PAGE_LABELS.EMPTY}
            gridTemplateColumns={EMPLOYEES_PAGE_GRID}
            error={isError ? EMPLOYEES_PAGE_LABELS.LOAD_ERROR : null}
            onRetry={refetch}
            onRowClick={handleRowClick}
            pagination={{
              page,
              total,
              totalPages,
              perPage: EMPLOYEES_PAGE_PER_PAGE,
              onPageChange: setPage,
            }}
          />
        </div>

        {canImport && (
          <ImportEmployeesModal open={isImportOpen} onClose={() => setIsImportOpen(false)} />
        )}

        {editingEmployee && (
          <EditEmployeeModal
            employee={editingEmployee}
            onClose={() => setEditingEmployee(null)}
            onSuccess={() => {
              setEditingEmployee(null);
              void refetch();
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default EmployeesPage;
