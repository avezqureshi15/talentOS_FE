import type { ComponentType } from "react";
import { motion } from "framer-motion";
import { staggerContainer, slideInLeft, springSoft } from "@/utils/motion";
import { SidebarItem } from "@/components/ui/sidebar";
import { SIDEBAR_LABELS } from "@/constants/constants";

type SidebarNavProps = {
  Icon: Record<string, ComponentType>;
  onSearch?: () => void;
  onClose: () => void;
};

const navItems = [
  { icon: "bx bx-home", label: SIDEBAR_LABELS.HIRING_REQUESTS, shortcut: "Ctrl+Shift+H", href: "/hiring-requests" },
  { icon: "bx bx-calendar-check", label: "Interviews", shortcut: "Ctrl+Shift+I", href: "/hiring-requests?tab=interviews" },
  { icon: "bx bx-bell", label: "Alerts", shortcut: "Ctrl+Shift+A", href: "/hiring-requests?tab=alerts" },
];

export default function SidebarNav({ Icon, onSearch, onClose }: SidebarNavProps) {
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
        {navItems.map((item) => (
          <motion.div key={item.href} variants={slideInLeft} transition={springSoft}>
            <SidebarItem
              icon={<span className={`${item.icon} text-lg`} />}
              label={item.label}
              shortcut={item.shortcut}
              href={item.href}
            />
          </motion.div>
        ))}
        <motion.div variants={slideInLeft} transition={springSoft}>
          <SidebarItem
            icon={<Icon.Search />}
            label={SIDEBAR_LABELS.SEARCH}
            shortcut="Ctrl+K"
            onClick={onSearch}
          />
        </motion.div>
        <motion.div variants={slideInLeft} transition={springSoft}>
          <SidebarItem
            icon={<Icon.Edit />}
            label={SIDEBAR_LABELS.NEW_CHAT}
            shortcut="Ctrl+Shift+C"
            href="/chat"
          />
        </motion.div>
      </motion.div>
    </>
  );
}
