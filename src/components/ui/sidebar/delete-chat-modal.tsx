import BaseModal from "@/components/ui/modal/base-modal";
import { SIDEBAR_LABELS } from "@/constants/constants";

type DeleteChatModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteChatModal = ({ open, onClose, onConfirm }: DeleteChatModalProps) => (
  <BaseModal open={open} onClose={onClose} title={SIDEBAR_LABELS.DELETE_CHAT_TITLE}>
    <div className="sidebar-delete-body">
      <p className="sidebar-delete-text">{SIDEBAR_LABELS.DELETE_CHAT_CONFIRM}</p>
      <div className="sidebar-delete-actions">
        <button className="sidebar-delete-btn sidebar-delete-btn--cancel" onClick={onClose}>
          {SIDEBAR_LABELS.CANCEL}
        </button>
        <button className="sidebar-delete-btn sidebar-delete-btn--confirm" onClick={onConfirm}>
          {SIDEBAR_LABELS.DELETE_CONFIRM}
        </button>
      </div>
    </div>
  </BaseModal>
);

export default DeleteChatModal;
