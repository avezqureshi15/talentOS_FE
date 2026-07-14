import BaseModal from "@/components/ui/modal/base-modal";
import { SETTINGS_MODAL } from "@/constants/constants";
// import { useThemeStore } from "@/store/theme.store";
import "./settings-modal.css";

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
};

const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  // const theme = useThemeStore((s) => s.theme);
  // const toggleTheme = useThemeStore((s) => s.toggleTheme);

  return (
    <BaseModal open={open} onClose={onClose} title={SETTINGS_MODAL.TITLE} icon={SETTINGS_MODAL.ICON} className="settings-modal">
      <div className="settings-modal__body">
        {/*
        <div className="settings-theme-row">
          <div className="settings-theme-label">
            <span className={theme === "dark" ? "bx bx-moon" : "bx bx-sun"} />
            {SETTINGS_MODAL.THEME_LABEL}
          </div>
          <label className="settings-toggle">
            <input type="checkbox" checked={theme === "light"} onChange={toggleTheme} />
            <div className={`settings-toggle-track${theme === "light" ? " settings-toggle-track--active" : ""}`}>
              <div className="settings-toggle-thumb" />
            </div>
          </label>
        </div>
        <div className="settings-theme-row" style={{ justifyContent: "flex-end", gap: "8px", paddingTop: 0 }}>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            {theme === "dark" ? SETTINGS_MODAL.THEME_DARK : SETTINGS_MODAL.THEME_LIGHT}
          </span>
        </div>
        */}
      </div>
    </BaseModal>
  );
};

export default SettingsModal;
