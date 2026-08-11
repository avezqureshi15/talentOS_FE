import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "@/components/ui/data-table/data-table";
import { TruncatedCell } from "@/components/shared/truncated-cell/truncated-cell";
import Select from "@/components/ui/select/select";
import { PERMISSIONS } from "@/constants/permissions";
import { usePermissions } from "@/hooks/use-permissions";
import { useDepartments } from "@/app/dashboard/hiring-requests/hooks/use-departments";
import { useLocations } from "@/app/dashboard/hiring-requests/hooks/use-locations";
import { useTypes } from "@/app/dashboard/hiring-requests/hooks/use-types";
import AssignMemberModal from "@/app/dashboard/hiring-requests/components/assign-member-modal/assign-member-modal";
import { TABLE_EMPTY_STATE, DATE_FROM_LABEL, DATE_TO_LABEL, ALL_DEPARTMENTS, ALL_LOCATIONS, ALL_TYPES, ALL_STATUS, STATUS_ACTIVE, STATUS_CLOSED } from "./table.constants";
import type { HiringRequestsTableProps } from "./table.types";
import type { HiringRequest } from "@/services/hiring-requests/hiring-requests.types";
import DatePickerInput from "./date-picker-input";
import "./table.css";

const HiringRequestsTable = ({
  filters,
  data,
  page,
  perPage,
  total,
  totalPages,
  isLoading,
  error,
  onRetry,
  onFilterChange,
  onPageChange,
  onPerPageChange,
}: HiringRequestsTableProps) => {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const { data: departments = [] } = useDepartments();
  const { data: locations = [] } = useLocations();
  const { data: types = [] } = useTypes();

  const [assignJob, setAssignJob] = useState<HiringRequest | null>(null);
  const canAssignMembers = can(PERMISSIONS.JOB_TEAM_MANAGE);

  const handleFilterSelect = (key: string, value: string) => {
    if (key === "is_active") {
      onFilterChange({ is_active: value ? value === "true" : undefined });
    } else {
      onFilterChange({ [key]: value || undefined });
    }
  };

  const chipConfig: { key: string; label: string }[] = [];
  if (filters.department) chipConfig.push({ key: "department", label: `Dept: ${filters.department}` });
  if (filters.location) chipConfig.push({ key: "location", label: `Location: ${filters.location}` });
  if (filters.type) chipConfig.push({ key: "type", label: `Type: ${filters.type}` });
  if (filters.is_active !== undefined) chipConfig.push({ key: "is_active", label: `Status: ${filters.is_active ? "Active" : "Closed"}` });
  if (filters.created_from) chipConfig.push({ key: "created_from", label: `From: ${filters.created_from}` });
  if (filters.created_to) chipConfig.push({ key: "created_to", label: `To: ${filters.created_to}` });

  return (
    <>
      <DataTable
      columns={[
        {
          header: "Role",
          className: "dt-cell-name",
          render: (item) => (
            <div>
              <TruncatedCell text={item.title} className="role-title" />
              <TruncatedCell text={item.department} className="role-meta" />
            </div>
          ),
        },
        {
          header: "Location",
          render: (item) => <TruncatedCell text={item.location} className="location-cell" />,
        },
        {
          header: "Status",
          render: (item) => (
            <span className={`dt-badge dt-badge--${item.is_active ? "active" : "inactive"}`}>
              {item.is_active ? STATUS_ACTIVE : STATUS_CLOSED}
            </span>
          ),
        },
        {
          header: "Type",
          render: (item) => <TruncatedCell text={item.type} className="type-cell" />,
        },
        {
          header: "Created",
          className: "dt-cell-date",
          render: (item) =>
            new Date(item.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
        },
        ...(canAssignMembers
          ? [
              {
                header: "Actions",
                className: "dt-cell-right",
                render: (item: HiringRequest) => (
                  <div className="dt-actions">
                    <button
                      type="button"
                      className="table-action-btn"
                      title="Assign Member"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAssignJob(item);
                      }}
                    >
                      <i className="bx bx-user-plus" />
                      <span>Assign Member</span>
                    </button>
                  </div>
                ),
              },
            ]
          : []),
      ]}
      data={data}
      loading={isLoading}
      error={error}
      onRetry={onRetry}
      keyExtractor={(item) => item.id}
      emptyMessage={TABLE_EMPTY_STATE}
      gridTemplateColumns={
        canAssignMembers ? "2fr 1fr 1fr 1.5fr 1fr 150px" : "2fr 1fr 1fr 1.5fr 1fr"
      }
      onRowClick={(item) => navigate(`/hiring-requests/${item.id}`)}
      toolbar={
        <>
          <div className="filter-bar">
            <Select
              placeholder={ALL_DEPARTMENTS}
              value={filters.department ?? ""}
              onChange={(e) => handleFilterSelect("department", e.target.value)}
              options={departments.map((d) => ({ value: d, label: d }))}
              size="md"
            />

            <Select
              placeholder={ALL_LOCATIONS}
              value={filters.location ?? ""}
              onChange={(e) => handleFilterSelect("location", e.target.value)}
              options={locations.map((l) => ({ value: l, label: l }))}
              size="md"
            />

            <Select
              placeholder={ALL_TYPES}
              value={filters.type ?? ""}
              onChange={(e) => handleFilterSelect("type", e.target.value)}
              options={types.map((t) => ({ value: t, label: t }))}
              size="md"
            />

            <Select
              placeholder={ALL_STATUS}
              value={filters.is_active === undefined ? "" : String(filters.is_active)}
              onChange={(e) => handleFilterSelect("is_active", e.target.value)}
              options={[
                { value: "true", label: STATUS_ACTIVE },
                { value: "false", label: STATUS_CLOSED },
              ]}
              size="md"
            />

            <DatePickerInput
              label={DATE_FROM_LABEL}
              value={filters.created_from ?? ""}
              onChange={(v) => onFilterChange({ created_from: v || undefined, page: 1 })}
            />

            <DatePickerInput
              label={DATE_TO_LABEL}
              value={filters.created_to ?? ""}
              onChange={(v) => onFilterChange({ created_to: v || undefined, page: 1 })}
            />
          </div>

          {chipConfig.length > 0 && (
            <div className="filter-chips">
              {chipConfig.map((chip) => (
                <span key={chip.key} className="filter-chip">
                  {chip.label}
                  <i className="bx bx-x filter-chip-x" onClick={() => handleFilterSelect(chip.key, "")} />
                </span>
              ))}
            </div>
          )}
        </>
      }
      pagination={{
        page,
        perPage,
        total,
        totalPages,
        onPageChange,
        onPerPageChange,
      }}
      animated
      />
      {assignJob && (
        <AssignMemberModal job={assignJob} onClose={() => setAssignJob(null)} />
      )}
    </>
  );
};export default HiringRequestsTable;
