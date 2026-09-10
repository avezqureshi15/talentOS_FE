import type { ComponentType, ReactNode } from "react";
import { motion } from "framer-motion";
import { staggerContainer, springSoft } from "@/utils/motion";
import { SidebarItem, SidebarSection } from "@/components/ui/sidebar";
import { useAuth } from "@/app/auth/hooks/use-auth";
import type { NavGroupConfig } from "@/layouts/protected-layouts/navigation.config";
import { getPersonaLabel } from "@/constants/personas";
import { useDocumentTitle } from "@/hooks/use-document-title";

type SidebarNavProps = {
  Icon: Record<string, ComponentType>;
  onClose: () => void;
  groups: NavGroupConfig[];
  hideExtras?: boolean;
};

export default function SidebarNav({ Icon, onClose, groups }: SidebarNavProps) {
  const { user } = useAuth();
  const personaLabel = getPersonaLabel(user?.role);
  useDocumentTitle(personaLabel ? `TalentOS | ${personaLabel}` : undefined);

  const renderNavItem = (item: NavGroupConfig["items"][number]): ReactNode => (
    <motion.div
      key={item.href}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={springSoft}
    >
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
        {groups.map((group) => (
          <SidebarSection
            key={group.label}
            title={group.label}
            collapsible
            defaultOpen
            titleClassName="sidebar-group-title"
          >
            {group.items.map(renderNavItem)}
          </SidebarSection>
        ))}
      </motion.div>
    </>
  );
}
