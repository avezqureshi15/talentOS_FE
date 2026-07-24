import type { DataTableProps } from "./data-table.types";
import "./data-table.css";

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading,
  emptyMessage = "No data found",
  gridTemplateColumns,
  onRowClick,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="dt-wrapper">
        <div className="dt">
          <div className="dt-row" style={{ gridTemplateColumns }}>
            {columns.map((col, i) => (
              <div key={i} className={col.className} style={col.style}>
                {col.header}
              </div>
            ))}
            {[1, 2, 3].map((n) => (
              <div key={n} className="dt-row" style={{ gridTemplateColumns }}>
                {columns.map((_, j) => (
                  <div key={j} className="dt-skeleton" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="dt-wrapper">
        <div className="dt">
          <div className="dt-row" style={{ gridTemplateColumns }}>
            {columns.map((col, i) => (
              <div key={i} className={col.className} style={col.style}>
                {col.header}
              </div>
            ))}
          </div>
        </div>
        <div className="dt-empty">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="dt-wrapper">
      <div className="dt">
        <div className="dt-row dt-header" style={{ gridTemplateColumns }}>
          {columns.map((col, i) => (
            <div key={i} className={col.className} style={col.style}>
              {col.header}
            </div>
          ))}
        </div>

        {data.map((row, i) => (
          <div
            key={keyExtractor(row, i)}
            className={`dt-row dt-row-body${onRowClick ? " dt-row--clickable" : ""}`}
            style={{ gridTemplateColumns, "--anim-delay": `${i * 30}ms` } as React.CSSProperties}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          >
            {columns.map((col, j) => (
              <div key={j} className={col.className} style={col.style}>
                {col.render(row, i)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
