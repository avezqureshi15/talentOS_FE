import type { ReactNode } from "react";

type SidebarGroupProps = {
  title: string;
  children: ReactNode;
};

const SidebarGroup = ({ title, children }: SidebarGroupProps) => (
  <>
    <p className="sidebar-group-title">{title}</p>
    {children}
  </>
);

export default SidebarGroup;
