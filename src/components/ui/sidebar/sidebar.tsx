import "./sidebar.css";

export type SidebarProps = {
  open: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
  className?: string;
};

export default function Sidebar({ open, onToggle, children, className }: SidebarProps) {
  return (
    <aside className={`sidebar ${!open ? "sidebar--collapsed" : ""} ${className ?? ""}`}>
      <div className="sidebar__inner">
        {children}
      </div>
    </aside>
  );
}
