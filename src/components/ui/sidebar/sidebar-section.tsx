import { useState } from "react";
import type { ReactNode } from "react";

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
        <div className="sidebar-section-header" onClick={handleToggle}>
          {title}
          <span className={`sidebar-chevron ${!isExpanded ? "sidebar-chevron--collapsed" : ""}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </span>
        </div>
      ) : (
        <div className="sidebar-group-title">{title}</div>
      )}
      {isExpanded && children}
    </div>
  );
}
