import { Link } from "react-router-dom";
import ErrorFallback from "@/components/ui/error-fallback/error-fallback";
import Select from "@/components/ui/select/select";
import { useDepartments } from "@/app/dashboard/hiring-requests/hooks/use-departments";
import { useLocations } from "@/app/dashboard/hiring-requests/hooks/use-locations";
import { useTypes } from "@/app/dashboard/hiring-requests/hooks/use-types";
import { TABLE_HEADERS, PER_PAGE_OPTIONS } from "@/constants/constants";
import { TABLE_EMPTY_STATE, PAGINATION_PREVIOUS, PAGINATION_NEXT } from "./table.constants";
import type { HiringRequestsTableProps } from "./table.types";
import "./table.css";

const SkeletonRow = () => (
  <div className="table-row">
    <div className="role-cell">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-meta" />
    </div>
    <div className="skeleton skeleton-badge" />
    <div className="skeleton skeleton-badge" />
    <div className="skeleton skeleton-badge" />
    <div className="skeleton skeleton-date" />
  </div>
);

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
  const { data: departments = [] } = useDepartments();
  const { data: locations = [] } = useLocations();
  const { data: types = [] } = useTypes();

  if (error) {
    return <ErrorFallback message={error} onRetry={onRetry} />;
  }

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

  const startItem = (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, total);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="table-wrapper">
      <div className="filter-bar">
        <Select
          placeholder="All Departments"
          value={filters.department ?? ""}
          onChange={(e) => handleFilterSelect("department", e.target.value)}
          options={departments.map((d) => ({ value: d, label: d }))}
        />

        <Select
          placeholder="All Locations"
          value={filters.location ?? ""}
          onChange={(e) => handleFilterSelect("location", e.target.value)}
          options={locations.map((l) => ({ value: l, label: l }))}
        />

        <Select
          placeholder="All Types"
          value={filters.type ?? ""}
          onChange={(e) => handleFilterSelect("type", e.target.value)}
          options={types.map((t) => ({ value: t, label: t }))}
        />

        <Select
          placeholder="All Status"
          value={filters.is_active === undefined ? "" : String(filters.is_active)}
          onChange={(e) => handleFilterSelect("is_active", e.target.value)}
          options={[
            { value: "true", label: "Active" },
            { value: "false", label: "Closed" },
          ]}
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

      <div className="table">
        <div className="table-row table-header">
          <div>{TABLE_HEADERS[0]}</div>
          <div>{TABLE_HEADERS[1]}</div>
          <div>{TABLE_HEADERS[2]}</div>
          <div>{TABLE_HEADERS[3]}</div>
          <div>{TABLE_HEADERS[4]}</div>
        </div>

        {isLoading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : data.length === 0 ? (
          <div className="table-empty">{TABLE_EMPTY_STATE}</div>
        ) : (
          data.map((item, idx) => (
            <Link
              key={item.id}
              to={`/hiring-requests/${item.id}`}
              className="table-row table-row-link"
              style={{ '--anim-delay': `${idx * 50}ms` }}
            >
              <div className="role-cell">
                <div className="role-title">{item.title}</div>
                <div className="role-meta">{item.department}</div>
              </div>

              <div className="location-cell">{item.location}</div>

              <div>
                <span
                  className={`status-badge ${item.is_active ? "status-active" : "status-closed"}`}
                >
                  {item.is_active ? "Active" : "Closed"}
                </span>
              </div>

              <div className="type-cell">{item.type}</div>

              <div className="created-cell">
                {new Date(item.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="pagination-bar">
        <div className="pagination-info">
          Showing {startItem}–{endItem} of {total}
        </div>

        <div className="pagination-controls">
          <button
            className="pagination-btn"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            {PAGINATION_PREVIOUS}
          </button>

          {pages.map((p) => (
            <button
              key={p}
              className={`pagination-btn ${p === page ? "pagination-btn-active" : ""}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ))}

          <button
            className="pagination-btn"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            {PAGINATION_NEXT}
          </button>
        </div>

        <div className="pagination-per-page">
          <Select
            value={String(perPage)}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            options={PER_PAGE_OPTIONS.map((n) => ({ value: String(n), label: `${n} / page` }))}
          />
        </div>
      </div>
    </div>
  );
};

export default HiringRequestsTable;
