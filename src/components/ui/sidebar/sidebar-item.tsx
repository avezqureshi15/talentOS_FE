import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { springSnap } from "@/utils/motion";
import "./sidebar.css";

export type SidebarItemProps = {
  icon?: ReactNode;
  label: string;
  shortcut?: string;
  active?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
  children?: ReactNode;
};

export default function SidebarItem({
  icon,
  label,
  shortcut,
  active,
  onClick,
  href,
  className,
  children,
}: SidebarItemProps) {
  const classes = `sidebar-item ${active ? "sidebar-item--active" : ""} ${className ?? ""}`;

  const content = (
    <>
      {icon}
      <span className="sidebar-item-label">{label}</span>
      {shortcut && <span className="sidebar-item-shortcut">{shortcut}</span>}
      {children}
    </>
  );

  if (href) {
    return (
      <motion.div
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.98 }}
        transition={springSnap}
      >
        <Link to={href} className={classes}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      className={classes}
      onClick={onClick}
      type="button"
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.98 }}
      transition={springSnap}
    >
      {content}
    </motion.button>
  );
}
