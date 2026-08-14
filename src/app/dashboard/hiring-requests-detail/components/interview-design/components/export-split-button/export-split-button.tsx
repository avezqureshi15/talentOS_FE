import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ClipboardList, Download, FileText, Loader2, Mic } from "lucide-react";
import { PLANNER_KIND_SWITCHER_LABELS } from "../planner-kind-switcher/planner-kind-switcher.constants";
import type { InterviewDesignExportKind } from "../../export/export-kinds";
import type { ExportSplitButtonProps } from "./export-split-button.types";

import "./export-split-button.css";

const EXPORT_ITEMS: {
  kind: Exclude<InterviewDesignExportKind, "all">;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    kind: "screening",
    label: PLANNER_KIND_SWITCHER_LABELS.SCREENING,
    icon: <FileText size={15} />,
  },
  {
    kind: "interview",
    label: PLANNER_KIND_SWITCHER_LABELS.INTERVIEW,
    icon: <Mic size={15} />,
  },
  {
    kind: "review",
    label: PLANNER_KIND_SWITCHER_LABELS.REVIEW,
    icon: <ClipboardList size={15} />,
  },
];

export const ExportSplitButton = ({
  handleExport,
  exportingKind,
  isExporting = false,
  disabled = false,
}: ExportSplitButtonProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const isExportingAll = exportingKind === "all";
  const controlsDisabled = disabled || isExporting || isExportingAll;

  const run = (kind: InterviewDesignExportKind) => {
    setOpen(false);
    handleExport(kind);
  };

  return (
    <div className="ed-export" ref={rootRef}>
      <button
        type="button"
        className="ed-export-main"
        onClick={() => run("all")}
        disabled={controlsDisabled}
        aria-label="Export all"
      >
        {isExportingAll ? (
          <Loader2 size={15} className="ed-export-spin" />
        ) : (
          <Download size={15} />
        )}
        <span className="ed-export-main-label">
          {isExportingAll ? "Exporting..." : "Export All"}
        </span>
      </button>

      <span className="ed-export-sep" aria-hidden="true" />

      <button
        type="button"
        className={`ed-export-toggle${open ? " ed-export-toggle--open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        disabled={controlsDisabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Export options"
      >
        <ChevronDown size={15} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="ed-export-menu"
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <div className="ed-export-menu-label">Export to PDF</div>
            {EXPORT_ITEMS.map((item) => {
              const isItemExporting = exportingKind === item.kind;
              return (
                <button
                  key={item.kind}
                  type="button"
                  role="menuitem"
                  className="ed-export-item"
                  onClick={() => run(item.kind)}
                  disabled={controlsDisabled || isItemExporting}
                >
                  <span className="ed-export-item-icon">
                    {isItemExporting ? (
                      <Loader2 size={15} className="ed-export-spin" />
                    ) : (
                      item.icon
                    )}
                  </span>
                  <span className="ed-export-item-label">
                    {isItemExporting ? "Exporting..." : item.label}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExportSplitButton;