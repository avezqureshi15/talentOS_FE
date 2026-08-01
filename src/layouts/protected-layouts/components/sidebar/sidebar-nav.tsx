import type { ComponentType, ReactNode } from "react";
import { motion } from "framer-motion";
import { staggerContainer, slideInLeft, springSoft } from "@/utils/motion";
import { SidebarItem } from "@/components/ui/sidebar";
import SidebarGroup from "@/layouts/protected-layouts/components/sidebar/sidebar-group";
import { useAuth } from "@/app/auth/hooks/use-auth";
import type { NavItemConfig } from "@/layouts/protected-layouts/navigation.config";

const PERSONA_LABELS: Record<string, string> = {
  superadmin: "Super Admin",
  account_admin: "Account Admin",
  job_owner: "Job Owner",
  recruiter: "Recruiter",
  reviewer: "Reviewer",
};

type SidebarNavProps = {
  Icon: Record<string, ComponentType>;
  onClose: () => void;
  mainItems: NavItemConfig[];
  adminItems: NavItemConfig[];
  superadminItems: NavItemConfig[];
  hideExtras?: boolean;
};

export default function SidebarNav({ Icon, onClose, mainItems, adminItems, superadminItems }: SidebarNavProps) {
  const { user } = useAuth();
  const personaLabel = user?.role ? (PERSONA_LABELS[user.role] ?? user.role) : null;

  const renderNavItem = (item: NavItemConfig): ReactNode => (
    <motion.div key={item.href} variants={slideInLeft} transition={springSoft}>
      <SidebarItem
        icon={<span className={`${item.icon} text-lg`} />}
        label={item.label}
        shortcut={item.shortcut}
        href={item.href}
      />
    </motion.div>
  );

  return (
    <>
      <div className="sidebar__top">
        <div className="sidebar__brand">
          <Icon.Logo />
          {personaLabel && (
            <span className="sidebar-persona-sub" title={`Signed in as ${personaLabel}`}>
              {personaLabel}
            </span>
          )}
        </div>
        <button className="sidebar-item flex justify-end" onClick={onClose}>
          <Icon.DblChevron />
        </button>
      </div>

      <motion.div
        className="sidebar__nav"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {mainItems.map(renderNavItem)}

        {adminItems.length > 0 && <div className="sidebar-nav-divider" />}
        {adminItems.map(renderNavItem)}

        {superadminItems.length > 0 && <div className="sidebar-nav-divider" />}
        {superadminItems.map((item) => (
          item.label === "Apps" ? (
            <SidebarGroup key="developers" title="Developers">
              {renderNavItem(item)}
            </SidebarGroup>
          ) : (
            renderNavItem(item)
          )
        ))}


      </motion.div>
    </>
  );
}
