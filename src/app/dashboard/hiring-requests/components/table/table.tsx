import { Link } from "react-router-dom";
import Dropdown from "@/components/ui/dropdown/dropdown";
import ErrorFallback from "@/components/ui/error-fallback/error-fallback";
import { TABLE_HEADERS, DROPDOWN_OPTIONS } from "@/constants/constants";
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
    <div className="skeleton skeleton-dropdown" />
    <div className="skeleton skeleton-date" />
  </div>
);

const HiringRequestsTable = ({ data, isLoading, error, onRetry }: HiringRequestsTableProps) => {
  if (error) {
    return <ErrorFallback message={error} onRetry={onRetry} />;
  }

  return (
    <div className="table-wrapper">
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
        ) : (
          data.map((item, idx) => (
            <Link
              key={item.id}
              to={`/hiring-requests/${item.id}`}
              className="table-row table-row-link"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="role-cell">
                <div className="role-title">{item.title}</div>
                <div className="role-meta">{item.department}</div>
              </div>

              <div className="applicants-cell">—</div>

              <div>
                <span
                  className={`status-badge ${item.is_active ? "status-active" : "status-closed"}`}
                >
                  {item.is_active ? "active" : "closed"}
                </span>
              </div>

              <div className="dropdown-cell">
                <Dropdown
                  options={[...DROPDOWN_OPTIONS]}
                  defaultValue={DROPDOWN_OPTIONS[2]}
                  onChange={() => {}}
                />
              </div>

              <div className="created-cell">
                {new Date(item.created_at).toLocaleDateString()}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default HiringRequestsTable;
