import { motion } from "framer-motion";
import "./sidebar.css";

export type SidebarProps = {
  open: boolean;
  children: React.ReactNode;
  className?: string;
};

export default function Sidebar({ open, children, className }: SidebarProps) {
  return (
    <motion.aside
      className={`sidebar ${open ? "sidebar--expanded" : "sidebar--collapsed"} ${className ?? ""}`}
      animate={{ width: open ? 280 : 56, minWidth: open ? 280 : 56 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="sidebar__inner">
        {children}
      </div>
    </motion.aside>
  );
}
