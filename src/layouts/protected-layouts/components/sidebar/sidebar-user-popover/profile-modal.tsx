import { useState } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import { useAuth } from "@/app/auth/hooks/use-auth";
import { PersonAvatar } from "@/components/shared/person-avatar/person-avatar";
import { PROFILE_MODAL } from "@/constants/constants";
import "./profile-modal.css";

type ProfileModalProps = {
  open: boolean;
  onClose: () => void;
};

const ProfileModal = ({ open, onClose }: ProfileModalProps) => {
  const { user } = useAuth();

  // justification: showConfirm toggles the delete-all-chats confirmation UI
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteAll = () => {
    setShowConfirm(false);
    onClose();
  };

  return (
    <BaseModal open={open} onClose={onClose} title={PROFILE_MODAL.TITLE} icon={PROFILE_MODAL.ICON} className="profile-modal">
      <div className="profile-modal__body">
        <div className="profile-modal__user">
          <PersonAvatar
            className="profile-modal__avatar"
            person={{ name: user?.name ?? "User", email: user?.email }}
          />
          <div className="profile-modal__info">
            <div className="profile-modal__name">{user?.name ?? "\u2014"}</div>
            <div className="profile-modal__email">{user?.email ?? "\u2014"}</div>
          </div>
        </div>

        <div className="profile-modal__divider" />

        {!showConfirm ? (
          <div className="profile-modal__actions">
            <button
              className="profile-modal__delete-btn"
              onClick={() => setShowConfirm(true)}
              type="button"
            >
              <i className="bx bx-trash" />
              {PROFILE_MODAL.DELETE_CHATS}
            </button>
          </div>
        ) : (
          <div className="profile-modal__confirm">
            <p className="profile-modal__confirm-text">
              {PROFILE_MODAL.DELETE_CHATS_CONFIRM}
            </p>
            <div className="profile-modal__confirm-actions">
              <button
                className="profile-modal__confirm-btn profile-modal__confirm-btn--cancel"
                onClick={() => setShowConfirm(false)}
                type="button"
              >
                {PROFILE_MODAL.DELETE_CHATS_CANCEL}
              </button>
              <button
                className="profile-modal__confirm-btn profile-modal__confirm-btn--danger"
                onClick={handleDeleteAll}
                type="button"
              >
                <i className="bx bx-trash" />
                {PROFILE_MODAL.DELETE_CHATS_CONFIRM_BTN}
              </button>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default ProfileModal;
