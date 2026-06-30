import BaseModal from "@/components/ui/modal/base-modal";
import { CANCEL_INTERVIEW_LABEL, CANCEL_CONFIRM_LABEL } from "./interviews.constants";
import "./cancel-interview-modal.css";

type CancelInterviewModalProps = {
  open: boolean;
  candidateName: string;
  onClose: () => void;
  onConfirm: () => void;
};

const CancelInterviewModal = ({ open, candidateName, onClose, onConfirm }: CancelInterviewModalProps) => (
  <BaseModal open={open} onClose={onClose} title={CANCEL_INTERVIEW_LABEL}>
    <div className="cancel-modal-body">
      <p className="cancel-modal-text">
        Are you sure you want to cancel the interview with <strong>{candidateName}</strong>? This action cannot be undone.
      </p>
      <div className="cancel-modal-actions">
        <button className="cancel-modal-btn cancel-modal-btn--cancel" onClick={onClose} type="button">
          Go Back
        </button>
        <button className="cancel-modal-btn cancel-modal-btn--confirm" onClick={onConfirm} type="button">
          {CANCEL_CONFIRM_LABEL}
        </button>
      </div>
    </div>
  </BaseModal>
);

export default CancelInterviewModal;
