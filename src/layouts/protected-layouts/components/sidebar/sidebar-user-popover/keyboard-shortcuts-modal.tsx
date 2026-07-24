import BaseModal from "@/components/ui/modal/base-modal";
import { KEYBOARD_SHORTCUTS_MODAL, KEYBOARD_SHORTCUTS_LIST } from "@/constants/constants";
import { useRole } from "@/app/auth/hooks/use-auth";
import "./keyboard-shortcuts-modal.css";

type KeyboardShortcutsModalProps = {
  open: boolean;
  onClose: () => void;
};

const SUPERADMIN_SHORTCUTS = new Set(["Toggle Sidebar", "Shortcuts Menu"]);

const renderKeys = (keys: string) =>
  keys.split("+").map((key) => (
    <span key={key} className="keyboard-shortcuts-modal__key">{key}</span>
  ));

const KeyboardShortcutsModal = ({ open, onClose }: KeyboardShortcutsModalProps) => {
  const { role } = useRole();
  const isSuperadmin = role === "superadmin";
  const shortcuts = isSuperadmin
    ? KEYBOARD_SHORTCUTS_LIST.filter((s) => SUPERADMIN_SHORTCUTS.has(s.label))
    : KEYBOARD_SHORTCUTS_LIST;

  return (
    <BaseModal open={open} onClose={onClose} title={KEYBOARD_SHORTCUTS_MODAL.TITLE} icon={KEYBOARD_SHORTCUTS_MODAL.ICON} className="keyboard-shortcuts-modal">
      <div className="keyboard-shortcuts-modal__body">
        {shortcuts.map((shortcut) => (
          <div key={shortcut.label} className="keyboard-shortcuts-modal__item">
            <span className="keyboard-shortcuts-modal__label">{shortcut.label}</span>
            <div className="keyboard-shortcuts-modal__keys">
              {renderKeys(shortcut.keys)}
            </div>
          </div>
        ))}
      </div>
    </BaseModal>
  );
};

export default KeyboardShortcutsModal;
