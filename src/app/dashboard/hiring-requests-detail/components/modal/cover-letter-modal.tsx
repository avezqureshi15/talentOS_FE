import BaseModal from "@/components/ui/modal/base-modal";
import type { CoverLetterModalProps } from "./cover-letter-modal.types";
import { COVER_LETTER_MODAL } from "./cover-letter-modal.constants";
import "./cover-letter-modal.css"

const CoverLetterModal = ({ open, applicantName, coverLetter, onClose }: CoverLetterModalProps) => (
  <BaseModal open={open} onClose={onClose} title={`${COVER_LETTER_MODAL.TITLE_PREFIX}${applicantName}`} icon="bx-notepad" className="cl-modal">
    <div className="cl-body">
      <div className="cl-text">{coverLetter}</div>
    </div>
  </BaseModal>
);

export default CoverLetterModal;
