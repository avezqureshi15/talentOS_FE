import type { ComponentType } from "react";
import { motion } from "framer-motion";
import { staggerContainer, slideInLeft, springSoft } from "@/utils/motion";
import { SidebarItem } from "@/components/ui/sidebar";
import type { NavItemConfig } from "@/layouts/protected-layouts/navigation.config";

type SidebarNavProps = {
  Icon: Record<string, ComponentType>;
  onSearch?: () => void;
  onClose: () => void;
  mainItems: NavItemConfig[];
  adminItems: NavItemConfig[];
  superadminItems: NavItemConfig[];
  hideExtras?: boolean;
};

export default function SidebarNav({ Icon, onClose, mainItems, adminItems, superadminItems }: SidebarNavProps) {
  const renderNavItem = (item: NavItemConfig) => (
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
        <Icon.Logo />
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
        {superadminItems.map(renderNavItem)}


      </motion.div>
    </>
  );
}
