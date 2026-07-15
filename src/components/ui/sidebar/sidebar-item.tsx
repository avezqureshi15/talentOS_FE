import type { ReactNode } from "react";
import { Link } from "react-router-dom";

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
      <Link to={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} type="button">
      {content}
    </button>
  );
}
