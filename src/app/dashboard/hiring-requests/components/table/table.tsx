import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ErrorFallback from "@/components/ui/error-fallback/error-fallback";
import Chip from "@/components/ui/chip/chip";
import Select from "@/components/ui/select/select";
import { useDepartments } from "@/app/dashboard/hiring-requests/hooks/use-departments";
import { useLocations } from "@/app/dashboard/hiring-requests/hooks/use-locations";
import { useTypes } from "@/app/dashboard/hiring-requests/hooks/use-types";
import { TABLE_HEADERS, PER_PAGE_OPTIONS } from "@/constants/constants";
import { TABLE_EMPTY_STATE, PAGINATION_PREVIOUS, PAGINATION_NEXT, DATE_FROM_LABEL, DATE_TO_LABEL, ALL_DEPARTMENTS, ALL_LOCATIONS, ALL_TYPES, ALL_STATUS, STATUS_ACTIVE, STATUS_CLOSED } from "./table.constants";
import type { HiringRequestsTableProps } from "./table.types";
import DatePickerInput from "./date-picker-input";
import SkeletonRow from "./skeleton-row";
import { spring, springSnap, staggerContainer } from "@/utils/motion";
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
  if (filters.created_from) chipConfig.push({ key: "created_from", label: `From: ${filters.created_from}` });
  if (filters.created_to) chipConfig.push({ key: "created_to", label: `To: ${filters.created_to}` });

  const startItem = (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, total);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="table-wrapper">
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
          <motion.div
            className="table-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={spring}
          >
            {TABLE_EMPTY_STATE}
          </motion.div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            {data.map((item) => (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <Link
                  to={`/hiring-requests/${item.id}`}
                  className="table-row table-row-link"
                >
                  <div className="role-cell">
                    <div className="role-title">{item.title}</div>
                    <div className="role-meta">{item.department}</div>
                  </div>

                  <div className="location-cell">{item.location}</div>

                  <div>
                    <Chip variant={item.is_active ? "success" : "danger"} size="md">
                      {item.is_active ? STATUS_ACTIVE : STATUS_CLOSED}
                    </Chip>
                  </div>

                  <div className="type-cell">{item.type}</div>

                  <div className="created-cell">
                    {new Date(item.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="pagination-bar">
        <div className="pagination-info">
          Showing {startItem}–{endItem} of {total}
        </div>

        <div className="pagination-controls">
          <motion.button
            className="pagination-btn"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            whileHover={page > 1 ? { scale: 1.05 } : undefined}
            whileTap={page > 1 ? { scale: 0.95 } : undefined}
            transition={springSnap}
          >
            {PAGINATION_PREVIOUS}
          </motion.button>

          {pages.map((p) => (
            <motion.button
              key={p}
              className={`pagination-btn ${p === page ? "pagination-btn-active" : ""}`}
              onClick={() => onPageChange(p)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={springSnap}
            >
              {p}
            </motion.button>
          ))}

          <motion.button
            className="pagination-btn"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            whileHover={page < totalPages ? { scale: 1.05 } : undefined}
            whileTap={page < totalPages ? { scale: 0.95 } : undefined}
            transition={springSnap}
          >
            {PAGINATION_NEXT}
          </motion.button>
        </div>

        <div className="pagination-per-page">
          <Select
            value={String(perPage)}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            options={PER_PAGE_OPTIONS.map((n) => ({ value: String(n), label: `${n} / page` }))}
            size="md"
          />
        </div>
      </div>
    </div>
  );
};

export default HiringRequestsTable;
