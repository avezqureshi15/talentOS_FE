import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import { SETTINGS_MODAL } from "@/constants/constants";
import { PERMISSIONS } from "@/constants/permissions";
import { useThemeStore, type ThemeMode } from "@/store/theme.store";
import { useAuth, useRole } from "@/app/auth/hooks/use-auth";
import { usePermissions } from "@/hooks/use-permissions";
import { ROUTES } from "@/constants/routes";
import ApiKeysSection from "@/app/superadmin/api-keys/components/api-keys-section";
import RoleDocsTable from "./role-docs-table";
import AiScreeningSection from "./ai-screening-section/ai-screening-section";
import "./settings-modal.css";

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
};

type SettingsTab = "theme" | "api-keys" | "apps" | "role-docs" | "ai-screening";

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: string }[] = [
  { value: "light", label: SETTINGS_MODAL.THEME_LIGHT, icon: "bx bx-sun" },
  { value: "dark", label: SETTINGS_MODAL.THEME_DARK, icon: "bx bx-moon" },
  { value: "system", label: SETTINGS_MODAL.THEME_SYSTEM, icon: "bx bx-desktop" },
];

const SETTINGS_TABS: { value: SettingsTab; label: string; icon: string }[] = [
  { value: "theme", label: "Theme", icon: "bx bx-palette" },
  { value: "api-keys", label: "API Keys", icon: "bx bx-key" },
  { value: "apps", label: SETTINGS_MODAL.APPS_TAB, icon: "bx bx-code-alt" },
  { value: "role-docs", label: "Role Docs", icon: "bx bx-book-open" },
  { value: "ai-screening", label: "AI Screening", icon: "bx bx-robot" },
];

const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  const { user } = useAuth();
  const { hasRole } = useRole();
  const isSuperAdmin = hasRole("superadmin");
  const { can } = usePermissions();
  const canManageApps = can("api_key.manage");
  const navigate = useNavigate();
  const [tab, setTab] = useState<SettingsTab>("theme");
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  // Per-tenant AI-screening settings — hidden for superadmin (no own tenant).
  const canViewAiScreening = !isSuperAdmin && !!user?.tenant_id && can(PERMISSIONS.SETTINGS_VIEW);

  // API keys: superadmin sees all scopes; tenant admins surface their own tenant-scope keys.
  const canViewApiKeys = isSuperAdmin || (!!user?.tenant_id && can(PERMISSIONS.SETTINGS_VIEW));

  const visibleTabs = SETTINGS_TABS.filter(
    (t) =>
      t.value === "theme" ||
      t.value === "role-docs" ||
      (t.value === "api-keys" && canViewApiKeys) ||
      (t.value === "apps" && canManageApps) ||
      (t.value === "ai-screening" && canViewAiScreening),
  );

  const handleManageApps = () => {
    onClose();
    navigate(isSuperAdmin ? ROUTES.SUPERADMIN_APPS : "/admin/apps");
  };

  return (
    <BaseModal open={open} onClose={onClose} title={SETTINGS_MODAL.TITLE} icon={SETTINGS_MODAL.ICON} className="settings-modal">
      <div className="settings-modal__layout">
        <aside className="settings-modal__sidebar">
          {visibleTabs.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`settings-sidebar-item${tab === item.value ? " settings-sidebar-item--active" : ""}`}
              onClick={() => setTab(item.value)}
            >
              <i className={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </aside>

        <div className="settings-modal__content">
          {tab === "theme" && (
            <div className="settings-modal__body">
              <div className="settings-theme-row">
                <div className="settings-theme-label">
                  <span className={theme === "dark" ? "bx bx-moon" : theme === "light" ? "bx bx-sun" : "bx bx-desktop"} />
                  {SETTINGS_MODAL.THEME_LABEL}
                </div>
              </div>
              <div className="settings-segment" role="group" aria-label={SETTINGS_MODAL.THEME_LABEL}>
                {THEME_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`settings-segment__option${theme === option.value ? " settings-segment__option--active" : ""}`}
                    onClick={() => setTheme(option.value)}
                  >
                    <i className={option.icon} />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
              <div className="settings-theme-row settings-theme-hint">
                <span>
                  {theme === "system" ? SETTINGS_MODAL.THEME_FOLLOWING_SYSTEM : theme === "dark" ? SETTINGS_MODAL.THEME_DARK : SETTINGS_MODAL.THEME_LIGHT}
                </span>
              </div>
            </div>
          )}

          {tab === "api-keys" && canViewApiKeys && (
            <div className="settings-modal__body settings-modal__body--api-keys">
              <ApiKeysSection />
            </div>
          )}

          {tab === "apps" && canManageApps && (
            <div className="settings-modal__body">
              <div className="settings-apps-card">
                <div className="settings-apps-info">
                  <span className="settings-apps-title">{SETTINGS_MODAL.APPS_TITLE}</span>
                  <span className="settings-apps-desc">{SETTINGS_MODAL.APPS_DESCRIPTION}</span>
                </div>
                <Button variant="primary" size="md" onClick={handleManageApps}>
                  <i className="bx bx-code-alt" />
                  {SETTINGS_MODAL.MANAGE_APPS}
                </Button>
              </div>
            </div>
          )}

          {tab === "role-docs" && (
            <div className="settings-modal__body settings-modal__body--role-docs">
              <RoleDocsTable />
            </div>
          )}

          {tab === "ai-screening" && canViewAiScreening && (
            <div className="settings-modal__body settings-modal__body--ai-screening">
              <AiScreeningSection />
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default SettingsModal;
