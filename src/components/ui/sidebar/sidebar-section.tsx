import { useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { spring, springWarm, springSoft } from "@/utils/motion";
import "./sidebar.css";

export type SidebarSectionProps = {
  title: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  onToggle?: (open: boolean) => void;
  children: ReactNode;
  className?: string;
};

export default function SidebarSection({
  title,
  collapsible = false,
  defaultOpen = true,
  onToggle,
  children,
  className,
}: SidebarSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  const isExpanded = collapsible ? open : true;

  const handleToggle = () => {
    if (!collapsible) return;
    const next = !open;
    setOpen(next);
    onToggle?.(next);
  };

  return (
    <div className={className ?? ""}>
      {collapsible ? (
        <motion.div
          className="sidebar-section-header"
          onClick={handleToggle}
          whileHover={{ x: 2 }}
          transition={spring}
        >
          {title}
          <motion.span
            className="sidebar-chevron"
            animate={{ rotate: isExpanded ? 0 : -90 }}
            transition={springWarm}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </motion.span>
        </motion.div>
      ) : (
        <div className="sidebar-group-title">{title}</div>
      )}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={springSoft}
            className="sidebar-section-content"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
