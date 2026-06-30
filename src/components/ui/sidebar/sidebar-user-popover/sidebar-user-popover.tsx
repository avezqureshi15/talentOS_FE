import { SIDEBAR_USER, PROFILE_MENU_ITEMS, PROFILE_DANGER_ITEM, LOGOUT_MODAL } from "@/constants/constants";
import { useSidebarUserPopover } from "@/components/ui/sidebar/sidebar-user-popover/use-sidebar-user-popover";
import BaseModal from "@/components/ui/modal/base-modal";
import ProfileModal from "@/components/ui/sidebar/sidebar-user-popover/profile-modal";
import SettingsModal from "@/components/ui/sidebar/sidebar-user-popover/settings-modal";
import KeyboardShortcutsModal from "@/components/ui/sidebar/sidebar-user-popover/keyboard-shortcuts-modal";
import { useUiStore } from "@/store/ui.store";
import "./sidebar-user-popover.css";

const SidebarUserPopover = () => {
  const {
    isOpen,
    onToggle,
    popoverRef,
    activeModal,
    openModal,
    closeModal,
  } = useSidebarUserPopover();

  const showShortcutsModal = useUiStore((s) => s.showShortcutsModal);
  const closeShortcutsModal = useUiStore((s) => s.closeShortcutsModal);

  return (
    <>
      <div className="sidebar-user" ref={popoverRef}>
        <button className="sidebar-user__trigger" onClick={onToggle} type="button">
          <div className="sidebar-avatar">{SIDEBAR_USER.INITIALS}</div>
          <div>
            <div className="sidebar-user__name">{SIDEBAR_USER.NAME}</div>
            <div className="sidebar-user__email">{SIDEBAR_USER.EMAIL}</div>
          </div>
        </button>

        {isOpen && (
          <div className="sidebar-user-popover">
            {PROFILE_MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                className="sidebar-user-popover__item"
                onClick={() => {
                  if (item.id === "keyboard-shortcuts") {
                    useUiStore.getState().openShortcutsModal();
                  } else {
                    openModal(item.id as "profile" | "settings");
                  }
                }}
                type="button"
              >
                <span className={`${item.icon} sidebar-user-popover__icon`} />
                {item.label}
              </button>
            ))}

            <div className="sidebar-user-popover__divider" />

            <button
              className="sidebar-user-popover__item sidebar-user-popover__item--danger"
              onClick={() => openModal("logout")}
              type="button"
            >
              <span className={`${PROFILE_DANGER_ITEM.icon} sidebar-user-popover__icon`} />
              {PROFILE_DANGER_ITEM.label}
            </button>
          </div>
        )}
      </div>

      <ProfileModal open={activeModal === "profile"} onClose={closeModal} />
      <SettingsModal open={activeModal === "settings"} onClose={closeModal} />
      <KeyboardShortcutsModal open={showShortcutsModal} onClose={closeShortcutsModal} />

      <BaseModal open={activeModal === "logout"} onClose={closeModal} title={LOGOUT_MODAL.TITLE} icon="bx bx-arrow-out-right-square-half">
        <div className="sidebar-delete-body">
          <p className="sidebar-delete-text">{LOGOUT_MODAL.BODY}</p>
          <div className="sidebar-delete-actions">
            <button className="sidebar-delete-btn sidebar-delete-btn--cancel" onClick={closeModal}>
              {LOGOUT_MODAL.CANCEL}
            </button>
            <button className="sidebar-delete-btn sidebar-delete-btn--confirm" onClick={closeModal}>
              {LOGOUT_MODAL.CONFIRM}
            </button>
          </div>
        </div>
      </BaseModal>
    </>
  );
};

export default SidebarUserPopover;
