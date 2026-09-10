import { motion } from "framer-motion";
import BaseModal from "@/components/ui/modal/base-modal";
import { SIDEBAR_LABELS } from "@/constants/constants";
import { springSnap } from "@/utils/motion";

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
        <motion.button
          className="sidebar-delete-btn sidebar-delete-btn--cancel"
          onClick={onClose}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={springSnap}
        >
          {SIDEBAR_LABELS.CANCEL}
        </motion.button>
        <motion.button
          className="sidebar-delete-btn sidebar-delete-btn--confirm"
          onClick={onConfirm}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={springSnap}
        >
          {SIDEBAR_LABELS.DELETE_CONFIRM}
        </motion.button>
      </div>
    </div>
  </BaseModal>
);

export default DeleteChatModal;