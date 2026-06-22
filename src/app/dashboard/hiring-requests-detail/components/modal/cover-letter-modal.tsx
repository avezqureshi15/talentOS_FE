import BaseModal from "@/components/ui/modal/base-modal";
import type { CoverLetterModalProps } from "./cover-letter-modal.types";
import "./cover-letter-modal.css"

const CoverLetterModal = ({ open, applicantName, coverLetter, onClose }: CoverLetterModalProps) => (
  <BaseModal open={open} onClose={onClose} title={`Cover Letter — ${applicantName}`} icon="bx-notepad" className="cl-modal">
    <div className="cl-body">
      <div className="cl-text">{coverLetter}</div>
    </div>
  </BaseModal>
);

export default CoverLetterModal;
