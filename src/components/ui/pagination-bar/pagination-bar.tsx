import { motion } from "framer-motion";
import Select from "@/components/ui/select/select";
import { springSnap } from "@/utils/motion";
import "./pagination-bar.css";

const PAGE_SIZE_OPTIONS = [5, 10, 15] as const;

type PaginationBarProps = {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
};

const PaginationBar = ({ page, totalPages, total, pageSize, onPageChange, onPageSizeChange }: PaginationBarProps) => {
  if (total === 0) return null;

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pb-bar">
      <div className="pb-info">
        Showing {startItem}–{endItem} of {total}
      </div>

      <div className="pb-controls">
        <motion.button
          className="pb-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          whileHover={page > 1 ? { scale: 1.05 } : undefined}
          whileTap={page > 1 ? { scale: 0.95 } : undefined}
          transition={springSnap}
        >
          Previous
        </motion.button>

        {pages.map((p) => (
          <motion.button
            key={p}
            className={`pb-btn ${p === page ? "pb-btn-active" : ""}`}
            onClick={() => onPageChange(p)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={springSnap}
          >
            {p}
          </motion.button>
        ))}

        <motion.button
          className="pb-btn"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          whileHover={page < totalPages ? { scale: 1.05 } : undefined}
          whileTap={page < totalPages ? { scale: 0.95 } : undefined}
          transition={springSnap}
        >
          Next
        </motion.button>
      </div>

      {onPageSizeChange && (
        <div className="pb-per-page">
          <Select
            value={String(pageSize)}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            options={PAGE_SIZE_OPTIONS.map((n) => ({ value: String(n), label: `${n} / page` }))}
            size="md"
          />
        </div>
      )}
    </div>
  );
};

export default PaginationBar;
