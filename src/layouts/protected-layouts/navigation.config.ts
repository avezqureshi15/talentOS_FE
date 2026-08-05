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

export type NavGroupConfig = {
  label: string;
  items: NavItemConfig[];
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
    label: "Employees",
    href: "/admin/employees",
    icon: "bx bx-people-diversity",
    permissions: ["employee.view"],
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
];
