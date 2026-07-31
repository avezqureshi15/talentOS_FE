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
    icon: "bx bx-briefcase",
    shortcut: "Ctrl+Shift+H",
    permissions: ["hiring_request.view"],
  },
  {
    label: "Alerts",
    href: "/alerts",
    icon: "bx bx-bell",
    shortcut: "Ctrl+Shift+A",
    permissions: ["application.view"],
  },
  {
    label: SIDEBAR_LABELS.NEW_CHAT,
    href: "/chat",
    icon: "bx bx-pencil",
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
    label: "Organization",
    href: "/admin/organization",
    icon: "bx bx-building",
    permissions: ["settings.view"],
  },
  {
    label: "Apps",
    href: "/admin/apps",
    icon: "bx bx-code-alt",
    permissions: ["api_key.manage"],
  },
];

export const SUPERADMIN_NAV_ITEMS: NavItemConfig[] = [
  {
    label: "Tenants",
    href: "/superadmin/tenants",
    icon: "bx bx-building",
    permissions: ["tenant.view"],
  },
  {
    label: "Roles",
    href: ROUTES.ROLES,
    icon: "bx bx-lock",
    permissions: ["user.manage"],
  },
  {
    label: "Apps",
    href: "/superadmin/apps",
    icon: "bx bx-code-alt",
    permissions: ["tenant.view"],
  },
];
