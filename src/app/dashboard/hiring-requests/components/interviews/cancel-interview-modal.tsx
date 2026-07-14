import { useState } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import { CANCEL_INTERVIEW_LABEL, CANCEL_CONFIRM_LABEL } from "./interviews.constants";
import { useCancelInterview } from "@/hooks/use-cancel-interview";
import "./cancel-interview-modal.css";

type CancelInterviewModalProps = {
  open: boolean;
  interviewId: string;
  candidateName: string;
  onClose: () => void;
  onConfirm: () => void;
};

const CancelInterviewModal = ({ open, interviewId, candidateName, onClose, onConfirm }: CancelInterviewModalProps) => {
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: cancelMut, isPending } = useCancelInterview();

  const handleConfirm = async () => {
    setError(null);
    try {
      await cancelMut(interviewId);
      onConfirm();
    } catch {
      setError("Failed to cancel interview. Please try again.");
    }
  };

  return (
    <BaseModal open={open} onClose={onClose} title={CANCEL_INTERVIEW_LABEL}>
      <div className="cancel-modal-body">
        <p className="cancel-modal-text">
          Are you sure you want to cancel the interview with <strong>{candidateName}</strong>? This action cannot be undone.
        </p>
        {error && <p className="cancel-modal-error">{error}</p>}
        <div className="cancel-modal-actions">
          <Button className="cancel-modal-btn cancel-modal-btn--cancel" onClick={onClose} disabled={isPending}>
            Go Back
          </Button>
          <Button className="cancel-modal-btn cancel-modal-btn--confirm" onClick={handleConfirm} loading={isPending} loadingText="Cancelling...">
            {CANCEL_CONFIRM_LABEL}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default CancelInterviewModal;
