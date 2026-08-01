import BaseModal from "@/components/ui/modal/base-modal";
import { SETTINGS_MODAL } from "@/constants/constants";
import { useThemeStore, type ThemeMode } from "@/store/theme.store";
import "./settings-modal.css";

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
};

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: string }[] = [
  { value: "light", label: SETTINGS_MODAL.THEME_LIGHT, icon: "bx bx-sun" },
  { value: "dark", label: SETTINGS_MODAL.THEME_DARK, icon: "bx bx-moon" },
  { value: "system", label: SETTINGS_MODAL.THEME_SYSTEM, icon: "bx bx-desktop" },
];

const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <BaseModal open={open} onClose={onClose} title={SETTINGS_MODAL.TITLE} icon={SETTINGS_MODAL.ICON} className="settings-modal">
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
    </BaseModal>
  );
};

export default SettingsModal;
