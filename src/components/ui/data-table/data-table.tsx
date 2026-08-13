import { motion } from "framer-motion";
import { TruncatedCell } from "@/components/shared/truncated-cell/truncated-cell";
import type { DataTableProps } from "./data-table.types";
import "./data-table.css";

const PER_PAGE_OPTIONS = [5, 10, 50];

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading,
  emptyMessage = "No data found",
  gridTemplateColumns,
  onRowClick,
  toolbar,
  pagination,
  selection,
  error,
  onRetry,
  rowClassName,
  animated = true,
}: DataTableProps<T>) {
  const gridTemplate = selection ? `40px ${gridTemplateColumns}` : gridTemplateColumns;

  const renderHeader = () => (
    <div className="dt-row dt-header" style={{ gridTemplateColumns: gridTemplate }}>
      {selection && (
        <div className="dt-cell--checkbox">
          <i
            className={`bx ${selection.allSelected ? "bx-checkbox-checked" : "bx-checkbox"} dt-checkbox`}
            onClick={selection.onToggleSelectAll}
          />
        </div>
      )}
      {columns.map((col, i) => (
        <div key={i} className={col.className} style={col.style}>
          {col.header}
        </div>
      ))}
    </div>
  );

  if (error && !loading) {
    return (
      <div className="dt-wrapper">
        {toolbar}
        <div className="dt-error">
          <span className="dt-error-text">{error}</span>
          {onRetry && (
            <button className="dt-retry-btn" type="button" onClick={onRetry}>
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="dt-wrapper">
      {toolbar}
      <div className="dt">
        {renderHeader()}

        {loading ? (
          [1, 2, 3].map((n) => (
            <div key={n} className="dt-row" style={{ gridTemplateColumns: gridTemplate }}>
              {selection && (
                <div className="dt-cell--checkbox">
                  <span className="dt-skeleton dt-skeleton--box" />
                </div>
              )}
              {columns.map((_, j) => (
                <div key={j} className="dt-skeleton-wrap">
                  <span className="dt-skeleton" />
                </div>
              ))}
            </div>
          ))
        ) : data.length === 0 ? (
          <div className="dt-empty">{emptyMessage}</div>
        ) : (
          data.map((row, i) => {
            const key = keyExtractor(row, i);
            const className = [
              "dt-row",
              "dt-row-body",
              onRowClick ? "dt-row--clickable" : "",
              rowClassName?.(row, i) ?? "",
            ]
              .filter(Boolean)
              .join(" ");

            const cellContent = (
              <>
                {selection && (
                  <div className="dt-cell--checkbox">
                    <i
                      className={`bx ${selection.selectedIds.has(String(key)) ? "bx-checkbox-checked" : "bx-checkbox"} dt-checkbox`}
                      onClick={(e) => {
                        e.stopPropagation();
                        selection.onToggleSelect(String(key));
                      }}
                    />
                  </div>
                )}
                {columns.map((col, j) => {
                  const rendered = col.render(row, i);
                  const cellChild =
                    col.truncate !== undefined && typeof rendered === "string" ? (
                      <TruncatedCell
                        text={rendered}
                        maxChars={typeof col.truncate === "number" ? col.truncate : undefined}
                        tooltipClassName={col.truncateTooltipClassName}
                      />
                    ) : (
                      rendered
                    );
                  return (
                    <div key={j} className={col.className} style={col.style}>
                      {cellChild}
                    </div>
                  );
                })}
              </>
            );

            if (animated) {
              return (
                <motion.div
                  key={key}
                  className={className}
                  style={{ gridTemplateColumns: gridTemplate }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {cellContent}
                </motion.div>
              );
            }

            return (
              <div
                key={key}
                className={className}
                style={{ gridTemplateColumns: gridTemplate, "--anim-delay": `${i * 30}ms` } as React.CSSProperties}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {cellContent}
              </div>
            );
          })
        )}
      </div>

      {pagination && (
        <div className="dt-pagination">
          <span className="dt-pagination-info">
            Showing {pagination.total === 0 ? 0 : (pagination.page - 1) * (pagination.perPage ?? 10) + 1}–
            {Math.min(pagination.page * (pagination.perPage ?? 10), pagination.total)} of {pagination.total}
          </span>
          <div className="dt-pagination-controls">
            <button
              type="button"
              className="dt-pagination-btn"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              Previous
            </button>
            {Array.from({ length: Math.max(pagination.totalPages, 1) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                className={`dt-pagination-btn${p === pagination.page ? " dt-pagination-btn--active" : ""}`}
                onClick={() => pagination.onPageChange(p)}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              className="dt-pagination-btn"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              Next
            </button>
          </div>
          {pagination.onPerPageChange && (
            <select
              className="dt-pagination-select"
              value={pagination.perPage ?? 10}
              onChange={(e) => pagination.onPerPageChange?.(Number(e.target.value))}
            >
              {PER_PAGE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
          )}
        </div>
      )}
    </div>
  );
}
