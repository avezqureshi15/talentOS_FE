import BaseModal from "@/components/ui/modal/base-modal";
import "./advance-target-modal.css";

type AdvanceTarget = "screening" | "interview";

type AdvanceTargetModalProps = {
  open: boolean;
  candidateName: string;
  onClose: () => void;
  onChoose: (target: AdvanceTarget) => void;
};

export default function AdvanceTargetModal({
  open,
  candidateName,
  onClose,
  onChoose,
}: AdvanceTargetModalProps) {
  return (
    <BaseModal open={open} onClose={onClose} title="Advance candidate">
      <div className="atm-body">
        <p className="atm-desc">
          Where should <strong>{candidateName}</strong> go next?
        </p>
        <div className="atm-choices">
          <button type="button" className="atm-choice" onClick={() => onChoose("screening")}>
            <i className="bx bx-phone" />
            <span className="atm-choice-title">AI screening</span>
            <span className="atm-choice-desc">Queue an automated screening call</span>
          </button>
          <button type="button" className="atm-choice" onClick={() => onChoose("interview")}>
            <i className="bx bx-calendar" />
            <span className="atm-choice-title">Interview</span>
            <span className="atm-choice-desc">Schedule an AI or human interview</span>
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
