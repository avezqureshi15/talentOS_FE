import type { Role } from "@/constants/roles";
import { SIDEBAR_LABELS } from "@/constants/constants";

export type NavItemConfig = {
  label: string;
  href: string;
  icon: string;
  shortcut?: string;
  minimumRole: Role;
  roles?: Role[];
};

export const MAIN_NAV_ITEMS: NavItemConfig[] = [
  {
    label: SIDEBAR_LABELS.HIRING_REQUESTS,
    href: "/hiring-requests",
    icon: "bx bx-home",
    shortcut: "Ctrl+Shift+H",
    minimumRole: "viewer",
    roles: ["admin", "hr", "viewer"],
  },
  {
    label: "Interviews",
    href: "/hiring-requests?tab=interviews",
    icon: "bx bx-calendar-check",
    shortcut: "Ctrl+Shift+I",
    minimumRole: "viewer",
    roles: ["admin", "hr", "viewer"],
  },
  {
    label: "Alerts",
    href: "/hiring-requests?tab=alerts",
    icon: "bx bx-bell",
    shortcut: "Ctrl+Shift+A",
    minimumRole: "viewer",
    roles: ["admin", "hr", "viewer"],
  },
  {
    label: SIDEBAR_LABELS.NEW_CHAT,
    href: "/chat",
    icon: "bx bx-message-square-add",
    shortcut: "Ctrl+Shift+C",
    minimumRole: "viewer",
    roles: ["admin", "hr", "viewer"],
  },
];

export const ADMIN_NAV_ITEMS: NavItemConfig[] = [
  {
    label: "Users",
    href: "/admin/users",
    icon: "bx bx-group",
    minimumRole: "admin",
    roles: ["admin"],
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: "bx bx-cog",
    minimumRole: "admin",
    roles: ["admin"],
  },
];

export const SUPERADMIN_NAV_ITEMS: NavItemConfig[] = [
  {
    label: "Tenants",
    href: "/superadmin/tenants",
    icon: "bx bx-building",
    minimumRole: "superadmin",
    roles: ["superadmin"],
  },
];
