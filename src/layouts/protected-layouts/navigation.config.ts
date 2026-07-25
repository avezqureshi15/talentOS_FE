import type { Permission } from "@/constants/permissions";
import { ROUTES } from "@/constants/routes";
import { SIDEBAR_LABELS } from "@/constants/constants";

export type NavItemConfig = {
  label: string;
  href: string;
  icon: string;
  shortcut?: string;
  permissions: Permission[];
};

export const MAIN_NAV_ITEMS: NavItemConfig[] = [
  {
    label: SIDEBAR_LABELS.HIRING_REQUESTS,
    href: "/hiring-requests",
    icon: "bx bx-home",
    shortcut: "Ctrl+Shift+H",
    permissions: ["hiring_request.view"],
  },
  {
    label: "Interviews",
    href: "/hiring-requests?tab=interviews",
    icon: "bx bx-calendar-check",
    shortcut: "Ctrl+Shift+I",
    permissions: ["application.view"],
  },
  {
    label: "Alerts",
    href: "/hiring-requests?tab=alerts",
    icon: "bx bx-bell",
    shortcut: "Ctrl+Shift+A",
    permissions: ["application.view"],
  },
  {
    label: SIDEBAR_LABELS.NEW_CHAT,
    href: "/chat",
    icon: "bx bx-message-square-add",
    shortcut: "Ctrl+Shift+C",
    permissions: ["chat"],
  },
];

export const ADMIN_NAV_ITEMS: NavItemConfig[] = [
  {
    label: "Users",
    href: "/admin/users",
    icon: "bx bx-group",
    permissions: ["user.invite"],
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: "bx bx-cog",
    permissions: ["settings.view"],
  },
];

export const SUPERADMIN_NAV_ITEMS: NavItemConfig[] = [
  {
    label: "Roles",
    href: ROUTES.ROLES,
    icon: "bx bx-lock",
    permissions: ["user.manage"],
  },
  {
    label: "Tenants",
    href: "/superadmin/tenants",
    icon: "bx bx-building",
    permissions: ["tenant.view"],
  },
];
