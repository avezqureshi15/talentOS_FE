import BaseModal from "@/components/ui/modal/base-modal";
import { SETTINGS_MODAL } from "@/constants/constants";
import "./profile-modal.css";

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
};

const SettingsModal = ({ open, onClose }: SettingsModalProps) => (
  <BaseModal open={open} onClose={onClose} title={SETTINGS_MODAL.TITLE} icon={SETTINGS_MODAL.ICON} className="profile-modal">
    <div className="profile-modal__body">
      <p className="profile-modal__email" style={{ textAlign: "center", padding: "32px 0" }}>
        {SETTINGS_MODAL.EMPTY}
      </p>
    </div>
  </BaseModal>
);

export default SettingsModal;
