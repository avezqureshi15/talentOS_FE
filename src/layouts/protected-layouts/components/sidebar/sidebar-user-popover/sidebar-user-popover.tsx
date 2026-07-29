import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PROFILE_MENU_ITEMS, PROFILE_DANGER_ITEM, LOGOUT_MODAL } from "@/constants/constants";
import { useSidebarUserPopover } from "@/layouts/protected-layouts/components/sidebar/sidebar-user-popover/use-sidebar-user-popover";
import { useAuth } from "@/app/auth/hooks/use-auth";
import { ROUTES } from "@/constants/routes";
import { getInitials } from "@/utils/user";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import ProfileModal from "@/layouts/protected-layouts/components/sidebar/sidebar-user-popover/profile-modal";
import KeyboardShortcutsModal from "@/layouts/protected-layouts/components/sidebar/sidebar-user-popover/keyboard-shortcuts-modal";
import { useUiStore } from "@/store/ui.store";
import "./sidebar-user-popover.css";

type SidebarUserPopoverProps = {
  autoOpen?: boolean;
  onAutoOpened?: () => void;
};

const SidebarUserPopover = ({ autoOpen, onAutoOpened }: SidebarUserPopoverProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // UI state for logout button loading indicator
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const showShortcutsModal = useUiStore((s) => s.showShortcutsModal);
  const closeShortcutsModal = useUiStore((s) => s.closeShortcutsModal);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate(ROUTES.LOGIN, { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout, navigate]);

  const {
    isOpen,
    onToggle,
    forceOpen,
    popoverRef,
    activeModal,
    openModal,
    closeModal,
  } = useSidebarUserPopover();

  // justification: auto-opens the user popover when sidebar expands from collapsed avatar click
  useEffect(() => {
    if (autoOpen) {
      forceOpen();
      onAutoOpened?.();
    }
  }, [autoOpen, forceOpen, onAutoOpened]);

  return (
    <>
      <div className="sidebar-user" ref={popoverRef}>
        <button className="sidebar-user__trigger" onClick={onToggle} type="button">
          <div className="sidebar-avatar">{user ? getInitials(user.name) : "?"}</div>
          <div>
            <div className="sidebar-user__name">{user?.name ?? "—"}</div>
            <div className="sidebar-user__email">{user?.email ?? "—"}</div>
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
                    openModal(item.id as "profile");
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
      <KeyboardShortcutsModal open={showShortcutsModal} onClose={closeShortcutsModal} />

      <BaseModal open={activeModal === "logout"} onClose={closeModal} title={LOGOUT_MODAL.TITLE} icon="bx bx-arrow-out-right-square-half">
        <div className="sidebar-delete-body">
          <p className="sidebar-delete-text">{LOGOUT_MODAL.BODY}</p>
          <div className="sidebar-delete-actions">
            <Button className="sidebar-delete-btn sidebar-delete-btn--cancel" onClick={closeModal}>
              {LOGOUT_MODAL.CANCEL}
            </Button>
            <Button className="sidebar-delete-btn sidebar-delete-btn--confirm" onClick={handleLogout} loading={isLoggingOut} loadingText="Logging out...">
              {LOGOUT_MODAL.CONFIRM}
            </Button>
          </div>
        </div>
      </BaseModal>
    </>
  );
};

export default SidebarUserPopover;
